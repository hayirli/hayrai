// pages/api/analyze.js — Veri analizi, çoklu model fallback

const NVIDIA_MODELS = ['deepseek-ai/deepseek-v4-pro','google/gemma-4-31b-it','deepseek-ai/deepseek-r1'];
const OPENROUTER_MODELS = ['deepseek/deepseek-chat-v3-0324:free','qwen/qwen3-8b:free','mistralai/mistral-small-3.1-24b-instruct:free','google/gemma-3-27b-it:free'];

async function tryProvider(provider, key, sys, usr) {
  if (provider === 'nvidia') {
    for (const model of NVIDIA_MODELS) {
      try { const r = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', { method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`}, body:JSON.stringify({model,messages:[{role:'system',content:sys},{role:'user',content:usr}],max_tokens:4096}) }); if(r.ok){const d=await r.json();const t=d.choices?.[0]?.message?.content;if(t)return t;} } catch(e){}
    }
  } else if (provider === 'openrouter') {
    for (const model of OPENROUTER_MODELS) {
      try { const r = await fetch('https://openrouter.ai/api/v1/chat/completions', { method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`}, body:JSON.stringify({model,messages:[{role:'system',content:sys},{role:'user',content:usr}],max_tokens:4096}) }); if(r.ok){const d=await r.json();const t=d.choices?.[0]?.message?.content;if(t&&t.length>50)return t;} } catch(e){}
    }
  } else if (provider === 'google') {
    for (const model of ['gemini-2.0-flash','gemini-1.5-flash']) {
      try { const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({contents:[{parts:[{text:sys+'\n\n'+usr}]}],generationConfig:{maxOutputTokens:4096}}) }); if(r.ok){const d=await r.json();const t=d.candidates?.[0]?.content?.parts?.[0]?.text;if(t)return t;} } catch(e){}
    }
  } else if (provider === 'claude') {
    try { const r = await fetch('https://api.anthropic.com/v1/messages', { method:'POST', headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01'}, body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:4096,system:sys,messages:[{role:'user',content:usr}]}) }); if(r.ok){const d=await r.json();return d.content?.[0]?.text||null;} } catch(e){}
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { data, analysisType, quality } = req.body;
  if (!data) return res.json({ noapi: true, msg: 'Veri gerekli' });

  const sys = `Sen istatistik uzmanısın. CSV verisini analiz et. Türkçe. SADECE JSON ver.`;
  const usr = `Veri:\n${data.substring(0,3000)}\n\nAnaliz: ${analysisType||'betimsel, korelasyon, normallik'}\n\nJSON: {"summary":"özet","n":"örneklem","variables":["..."],"descriptive":"betimsel tablo","normality":"normallik","correlation":"korelasyon","interpretation":"yorum","reportText":"APA 7 bulgular metni"}`;

  let result = null;

  if (quality === 'premium' && process.env.CLAUDE_API_KEY) {
    result = await tryProvider('claude', process.env.CLAUDE_API_KEY, sys, usr);
  }
  if (!result && process.env.NVIDIA_API_KEY) {
    result = await tryProvider('nvidia', process.env.NVIDIA_API_KEY, sys, usr);
  }
  if (!result && process.env.OPENROUTER_API_KEY) {
    result = await tryProvider('openrouter', process.env.OPENROUTER_API_KEY, sys, usr);
  }
  if (!result && process.env.GOOGLE_API_KEY) {
    result = await tryProvider('google', process.env.GOOGLE_API_KEY, sys, usr);
  }

  if (!result) return res.json({ noapi: true, msg: 'Veri analizi için API gereklidir. Tüm modeller şu an meşgul. info@hayrai.com' });

  const clean = result.replace(/```json\n?/g,'').replace(/```\n?/g,'').replace(/<think>[\s\S]*?<\/think>/g,'').trim();
  const m = clean.match(/\{[\s\S]*\}/);
  if (m) { try { return res.json(JSON.parse(m[0])); } catch(e) {} }
  return res.json({ raw: result });
}

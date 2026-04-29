// pages/api/generate.js — 4 alternatif + timeout yönetimi

// Vercel timeout'u 60 saniyeye uzat
export const config = { maxDuration: 60 };

const SYS = `Sen dünya çapında tanınmış bir akademik danışmansın. Yüksek kaliteli makale taslağı üret.
KURALLAR: Türkçe akademik dil. APA 7. GERÇEK kaynaklar (uydurma YASAK). Her bölüm 250+ kelime. İstatistik tabloları ekle. SADECE JSON ver.`;

function buildPrompt(p) {
  const { mode, topic, department, method, dataTools, sampleDesc, citation, hypothesis, analysisData } = p;
  const tools = (dataTools || []).join(", ") || "Anket";
  const extra = analysisData ? `\nAnaliz sonuçları:\n${analysisData}` : '';
  if (mode === "detailed") {
    return `"${topic}" konusunda ${department||'Sosyal Bilimler'} alanında ${method||'nicel'} yöntemle makale taslağı.
Veri: ${tools}. Örneklem: ${sampleDesc||'katılımcılar'}. ${citation||'APA 7'}. ${hypothesis?'Hipotez: '+hypothesis:''}${extra}
JSON: {"title":"başlık","abstract":"200+ kelime","keywords":["5+ kelime"],"sections":[
{"title":"1. GİRİŞ","content":"250+ kelime, problem, amaç, güncel veriler"},
{"title":"2. KAVRAMSAL ÇERÇEVE","content":"250+ kelime, kuramlar, literatür"},
{"title":"3. YÖNTEM","content":"250+ kelime, desen, örneklem, araç, analiz, etik, SPSS"},
{"title":"4. BULGULAR","content":"300+ kelime, tablolar, p değerleri, etki büyüklükleri"},
{"title":"5. TARTIŞMA VE SONUÇ","content":"250+ kelime, yorum, öneri, sınırlılık"},
{"title":"KAYNAKÇA","content":"12+ GERÇEK referans APA 7"}]}`;
  }
  return `"${topic}" sistematik derleme.${extra}
JSON: {"title":"başlık","abstract":"200+ kelime","keywords":["5+ kelime"],"sections":[
{"title":"1. GİRİŞ","content":"250+ kelime"},{"title":"2. KAVRAMSAL ÇERÇEVE","content":"250+ kelime"},
{"title":"3. YÖNTEM","content":"PRISMA 2020, 200+ kelime"},{"title":"4. BULGULAR","content":"tablolar, 300+ kelime"},
{"title":"5. SONUÇ","content":"250+ kelime"},{"title":"KAYNAKÇA","content":"10+ GERÇEK referans"}]}`;
}

// Timeout wrapper - 25 saniye limit per provider
function withTimeout(promise, ms = 25000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ]);
}

async function callProvider(name, fn) {
  try { return await withTimeout(fn()); } catch (e) { return null; }
}

function parseJSON(text) {
  if (!text) return null;
  const c = text.replace(/```json\n?/g,'').replace(/```\n?/g,'').replace(/<think>[\s\S]*?<\/think>/g,'').trim();
  const m = c.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch(e) {} }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { quality } = req.body;
  if (!req.body.topic) return res.json({ fallback: true });

  const usr = buildPrompt(req.body);

  if (quality === 'temel') return res.json({ fallback: true });

  if (quality === 'premium') {
    const k = process.env.CLAUDE_API_KEY;
    if (!k) return res.json({ noapi: true, msg: 'Premium API aktif değil. Abone olun: info@hayrai.com' });
    const result = await callProvider('Claude', async () => {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST', headers:{'Content-Type':'application/json','x-api-key':k,'anthropic-version':'2023-06-01'},
        body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:6000, system:SYS, messages:[{role:'user',content:usr}] })
      });
      if (!r.ok) return null;
      const d = await r.json();
      return { text: d.content?.[0]?.text, provider:'Claude' };
    });
    if (!result) return res.json({ noapi: true, msg: 'Premium API yanıt vermedi.' });
    const p = parseJSON(result.text);
    if (p) return res.json(p);
    return res.json({ fallback: true });
  }

  // ═══ İYİ SEVİYE — 4 sağlayıcı paralel ═══
  const nk = process.env.NVIDIA_API_KEY;
  const ork = process.env.OPENROUTER_API_KEY;
  const gk = process.env.GOOGLE_API_KEY;
  const ck = process.env.CLAUDE_API_KEY;

  if (!nk && !ork && !gk && !ck) return res.json({ noapi: true, msg: 'API tanımlı değil. info@hayrai.com' });

  const tasks = [];

  if (nk) tasks.push(callProvider('NVIDIA', async () => {
    for (const model of ['deepseek-ai/deepseek-v4-pro','google/gemma-4-31b-it','nvidia/nemotron-3-super-120b-a12b']) {
      try {
        const r = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${nk}`},
          body: JSON.stringify({model, messages:[{role:'system',content:SYS},{role:'user',content:usr}], max_tokens:6000, temperature:0.7})
        });
        if (r.ok) { const d = await r.json(); const t = d.choices?.[0]?.message?.content; if (t?.length > 200) return {text:t, provider:'Alternatif A'}; }
      } catch(e) {}
    }
    return null;
  }));

  if (ork) tasks.push(callProvider('OpenRouter', async () => {
    for (const model of ['deepseek/deepseek-chat-v3-0324:free','qwen/qwen3-8b:free','mistralai/mistral-small-3.1-24b-instruct:free','google/gemma-3-27b-it:free']) {
      try {
        const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${ork}`},
          body: JSON.stringify({model, messages:[{role:'system',content:SYS},{role:'user',content:usr}], max_tokens:6000})
        });
        if (r.ok) { const d = await r.json(); const t = d.choices?.[0]?.message?.content; if (t?.length > 200) return {text:t, provider:'Alternatif B'}; }
      } catch(e) {}
    }
    return null;
  }));

  if (gk) tasks.push(callProvider('Google', async () => {
    for (const model of ['gemini-2.0-flash','gemini-1.5-flash']) {
      try {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${gk}`, {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({contents:[{parts:[{text:SYS+'\n\n'+usr}]}], generationConfig:{maxOutputTokens:6000,temperature:0.7}})
        });
        if (r.ok) { const d = await r.json(); const t = d.candidates?.[0]?.content?.parts?.[0]?.text; if (t?.length > 200) return {text:t, provider:'Alternatif C'}; }
      } catch(e) {}
    }
    return null;
  }));

  if (ck) tasks.push(callProvider('Claude', async () => {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST', headers:{'Content-Type':'application/json','x-api-key':ck,'anthropic-version':'2023-06-01'},
      body: JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:6000, system:SYS, messages:[{role:'user',content:usr}]})
    });
    if (!r.ok) return null;
    const d = await r.json();
    return { text: d.content?.[0]?.text, provider:'Alternatif D' };
  }));

  const results = await Promise.allSettled(tasks);
  const alts = [];

  for (const r of results) {
    if (r.status === 'fulfilled' && r.value) {
      const parsed = parseJSON(r.value.text);
      if (parsed?.title && parsed?.sections?.length > 0) {
        alts.push({ ...parsed, _provider: r.value.provider });
      }
    }
  }

  if (alts.length === 0) return res.json({ noapi: true, msg: 'Modeller şu an meşgul. Birkaç dakika sonra tekrar deneyin.' });
  if (alts.length === 1) return res.json(alts[0]);
  return res.json({ alternatives: alts });
}

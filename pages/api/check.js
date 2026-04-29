// pages/api/check.js — API durumunu kontrol et
export default async function handler(req, res) {
  const status = { temel: true, iyi: false, premium: false, iyiProvider: null, premiumProvider: null };

  // Premium: Claude
  if (process.env.CLAUDE_API_KEY) {
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.CLAUDE_API_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 10, messages: [{ role: 'user', content: 'test' }] })
      });
      if (r.ok || r.status === 400) { status.premium = true; status.premiumProvider = "Claude"; }
    } catch(e) {}
  }

  // İyi: NVIDIA → OpenRouter → Google
  if (process.env.NVIDIA_API_KEY) {
    try {
      const r = await fetch('https://integrate.api.nvidia.com/v1/models', {
        headers: { 'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}` }
      });
      if (r.ok) { status.iyi = true; status.iyiProvider = "NVIDIA"; }
    } catch(e) {}
  }
  if (!status.iyi && process.env.OPENROUTER_API_KEY) {
    try {
      const r = await fetch('https://openrouter.ai/api/v1/models', {
        headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` }
      });
      if (r.ok) { status.iyi = true; status.iyiProvider = "OpenRouter"; }
    } catch(e) {}
  }
  if (!status.iyi && process.env.GOOGLE_API_KEY) {
    status.iyi = true; status.iyiProvider = "Google";
  }

  return res.json(status);
}

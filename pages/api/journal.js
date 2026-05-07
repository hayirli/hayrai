// pages/api/journal.js — Konuya uygun dergi bulucu (Claude API)
export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { topic, abstract, department, language } = req.body;
  if (!topic) return res.json({ error: 'Konu gerekli' });

  const key = process.env.CLAUDE_API_KEY;
  if (!key) return res.json({ noapi: true, msg: 'Dergi bulucu için Claude API gerekli. info@hayrai.com' });

  const sys = `Sen akademik yayıncılık uzmanısın. Araştırmacılara konularına uygun dergi öneriyorsun. SADECE JSON formatında yanıt ver.`;
  const usr = `Aşağıdaki araştırma için en uygun 8-10 akademik dergiyi öner:

Konu: ${topic}
${abstract ? 'Özet: ' + abstract : ''}
Alan: ${department || 'Sosyal Bilimler'}
Tercih edilen dil: ${language || 'Türkçe ve İngilizce'}

Her dergi için şu bilgileri ver:
- Derginin tam adı
- Yayıncı (Elsevier, Springer, Taylor & Francis, DergiPark vb.)
- ISSN
- Dizinlenme durumu (TR Dizin, Scopus, WoS, ESCI, ERIC vb.)
- Etki faktörü / CiteScore (tahmini veya bilinen)
- Ortalama değerlendirme süresi
- Kabul oranı (tahmini)
- Açık erişim durumu
- Neden bu konuya uygun olduğu (1-2 cümle)
- Dergi web sitesi URL'si

Hem Türkçe (TR Dizin, DergiPark, ULAKBİM) hem uluslararası dergileri dahil et.
Yırtıcı (predatory) dergi ÖNERİME — sadece saygın, hakemli dergileri öner.

JSON: {"journals":[{"name":"dergi adı","publisher":"yayıncı","issn":"ISSN","indexing":["TR Dizin","Scopus"],"impactFactor":"2.5 (2024)","reviewTime":"3-6 ay","acceptanceRate":"%25-30","openAccess":"Evet/Hayır/Hibrit","fitReason":"Bu konuya uygun çünkü...","url":"https://...","language":"Türkçe/İngilizce"},...],"recommendation":"En uygun ilk 3 derginin kısa değerlendirmesi ve strateji önerisi"}`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 4096, system: sys, messages: [{ role: 'user', content: usr }] })
    });
    if (!r.ok) return res.json({ noapi: true, msg: 'Claude API yanıt vermedi.' });
    const d = await r.json();
    const text = d.content?.[0]?.text || '';
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const m = clean.match(/\{[\s\S]*\}/);
    if (m) { try { return res.json(JSON.parse(m[0])); } catch (e) {} }
    return res.json({ raw: text });
  } catch (err) { return res.json({ noapi: true, msg: 'Bağlantı hatası: ' + err.message }); }
}

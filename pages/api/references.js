// pages/api/references.js — Konuya uygun kaynak bulucu (Claude API)
export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { topic, department, method, yearRange, citationFormat } = req.body;
  if (!topic) return res.json({ error: 'Konu gerekli' });

  const key = process.env.CLAUDE_API_KEY;
  if (!key) return res.json({ noapi: true, msg: 'Kaynak bulucu için Claude API gerekli. info@hayrai.com' });

  const sys = `Sen akademik literatür uzmanısın. Araştırmacılara konularına uygun GERÇEK akademik kaynaklar öneriyorsun. 
KRİTİK: Sadece GERÇEK, yayımlanmış, doğrulanabilir kaynaklar öner. UYDURMA KAYNAK YAZMA. 
Emin olmadığın kaynağı dahil etme. SADECE JSON formatında yanıt ver.`;

  const usr = `Aşağıdaki araştırma konusu için en uygun 15-20 akademik kaynak öner:

Konu: ${topic}
Alan: ${department || 'Sosyal Bilimler'}
Yöntem: ${method || 'belirtilmemiş'}
Yıl aralığı: ${yearRange || '2015-2025'}
Atıf formatı: ${citationFormat || 'APA 7'}

Her kaynak için şu bilgileri ver:
1. Tam bibliyografik künyesi (${citationFormat || 'APA 7'} formatında)
2. Kaynağın kısa özeti (2-3 cümle — ne bulmuş, ne tartışmış)
3. Bu araştırmada NEREDE atıf yapılmalı (Giriş, Kavramsal Çerçeve, Yöntem, Tartışma vb.)
4. Atıf türü (doğrudan alıntı mı, parafraz mı, destekleyici kanıt mı)
5. Kaynağın önemi (temel/destekleyici/opsiyonel)

Kaynakları şu kategorilere ayır:
- Kuramsal/Kavramsal kaynaklar (temel kuramlar, tanımlar)
- Yöntemsel kaynaklar (araştırma deseni, ölçekler, analiz)
- Ampirik kaynaklar (benzer çalışmalar, bulgular)
- Güncel kaynaklar (son 2-3 yıl, trend)

Hem Türkçe hem İngilizce kaynaklar dahil et.

JSON: {
  "references": [
    {
      "id": 1,
      "citation": "APA 7 formatında tam künyesi",
      "summary": "2-3 cümle özet",
      "useWhere": "Giriş / Kavramsal Çerçeve / Yöntem / Bulgular / Tartışma",
      "useHow": "Parafraz — konunun önemini desteklemek için",
      "importance": "Temel / Destekleyici / Opsiyonel",
      "category": "Kuramsal / Yöntemsel / Ampirik / Güncel",
      "year": 2023,
      "doi": "varsa DOI"
    }
  ],
  "summary": "Literatür haritası özeti — hangi konular yoğun, hangi boşluklar var",
  "suggestedStructure": "Bu kaynaklarla önerilen makale yapısı"
}`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 6000, system: sys, messages: [{ role: 'user', content: usr }] })
    });
    if (!r.ok) return res.json({ noapi: true, msg: 'Claude API yanıt vermedi.' });
    const d = await r.json();
    const text = d.content?.[0]?.text || '';
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const m = clean.match(/\{[\s\S]*\}/);
    if (m) { try { return res.json(JSON.parse(m[0])); } catch (e) {} }
    return res.json({ raw: text });
  } catch (err) { return res.json({ noapi: true, msg: err.message }); }
}

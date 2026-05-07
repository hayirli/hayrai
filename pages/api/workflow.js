// pages/api/workflow.js — Tam akış: Kaynak bul + Dergi seç + Makale yaz
export const config = { maxDuration: 120 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { topic, department, method, step, previousData } = req.body;
  if (!topic) return res.json({ error: 'Konu gerekli' });

  const key = process.env.CLAUDE_API_KEY;
  if (!key) return res.json({ noapi: true, msg: 'Tam akış için Claude API gerekli. info@hayrai.com' });

  let sys, usr;

  if (step === 1) {
    // ADIM 1: Konu analizi + kaynak önerisi + dergi önerisi
    sys = `Sen kıdemli bir akademik danışmansın. Araştırmacıya konusunu analiz et, kaynaklar öner ve uygun dergiler öner. SADECE JSON ver.`;
    usr = `Araştırma konusu: "${topic}"
Alan: ${department || 'Sosyal Bilimler'}
Yöntem tercihi: ${method || 'belirtilmemiş'}

ADIM 1 — Konu analizi, kaynak ve dergi önerisi yap.

JSON: {
  "topicAnalysis": {
    "refinedTitle": "Konuyu akademik başlığa çevir",
    "researchGap": "Literatürdeki boşluk nedir",
    "suggestedQuestions": ["3 araştırma sorusu"],
    "suggestedHypotheses": ["2 hipotez"],
    "suggestedMethod": "Önerilen yöntem ve gerekçesi",
    "keywords": ["7-10 anahtar kelime"]
  },
  "topReferences": [
    {"citation": "APA 7 künyesi", "summary": "2 cümle özet", "useWhere": "Giriş/Çerçeve/Yöntem", "importance": "Temel/Destekleyici", "category": "Kuramsal/Ampirik/Yöntemsel"},
    ... (en az 12 GERÇEK kaynak)
  ],
  "topJournals": [
    {"name": "Dergi adı", "publisher": "Yayıncı", "indexing": ["Scopus","TR Dizin"], "impactFactor": "değer", "reviewTime": "süre", "fitReason": "Neden uygun", "url": "link"},
    ... (en az 5 dergi)
  ],
  "workflowSuggestion": "Bu konuyla ilgili araştırma yapma stratejisi — 2-3 paragraf"
}`;
  } else if (step === 2) {
    // ADIM 2: Seçilen kaynak ve dergiye göre makale taslağı oluştur
    sys = `Sen kıdemli akademik danışmansın. Önceki adımdaki bilgileri kullanarak kapsamlı makale taslağı yaz. SADECE JSON ver.`;
    usr = `Araştırma: "${topic}"
Alan: ${department}
Önceki adımdan bilgiler: ${JSON.stringify(previousData).substring(0, 3000)}

ADIM 2 — Bu kaynak ve dergileri kullanarak kapsamlı makale taslağı oluştur.
Kaynaklara metin içi atıf yap (örn: Yılmaz, 2023). Her bölüm 300+ kelime olsun.

JSON: {
  "title": "Akademik başlık",
  "targetJournal": "Hedef dergi ve gerekçesi",
  "abstract": "250+ kelime özet",
  "keywords": ["anahtar kelimeler"],
  "sections": [
    {"title": "1. GİRİŞ", "content": "300+ kelime, metin içi atıflarla"},
    {"title": "2. KAVRAMSAL ÇERÇEVE", "content": "300+ kelime, kuramlar ve kaynaklar"},
    {"title": "3. YÖNTEM", "content": "300+ kelime, desen, örneklem, araç, analiz"},
    {"title": "4. BULGULAR", "content": "300+ kelime, tablolar, istatistikler"},
    {"title": "5. TARTIŞMA VE SONUÇ", "content": "300+ kelime, karşılaştırma, öneriler"},
    {"title": "KAYNAKÇA", "content": "Tüm atıf yapılan kaynakların listesi APA 7"}
  ]
}`;
  }

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 8000, system: sys, messages: [{ role: 'user', content: usr }] })
    });
    if (!r.ok) return res.json({ noapi: true, msg: 'API yanıt vermedi.' });
    const d = await r.json();
    const text = d.content?.[0]?.text || '';
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const m = clean.match(/\{[\s\S]*\}/);
    if (m) { try { return res.json(JSON.parse(m[0])); } catch (e) {} }
    return res.json({ raw: text });
  } catch (err) { return res.json({ noapi: true, msg: err.message }); }
}

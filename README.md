# HayrAI - Etik Akademik Araştırma Rehberi

Yapay zekâ destekli akademik araştırma rehberi platformu.

## 🚀 Vercel'e Deploy (3 Adım)

### Adım 1: GitHub'a Push
```bash
git init
git add .
git commit -m "HayrAI v1"
git remote add origin https://github.com/KULLANICI_ADIN/hayrai.git
git push -u origin main
```

### Adım 2: Vercel'e Bağla
1. https://vercel.com adresine git, GitHub ile giriş yap
2. "Add New Project" → GitHub reposunu seç
3. "Deploy" butonuna tıkla — otomatik build eder

### Adım 3: Domain Bağla
1. Vercel panelinde: Settings → Domains → "hayrai.com" yaz
2. Domain sağlayıcında (GoDaddy/Namecheap vb.) DNS'i ayarla:
   - A Record: 76.76.21.21
   - CNAME: cname.vercel-dns.com
3. SSL otomatik gelir ✅

## 📁 Proje Yapısı
```
hayrai-project/
├── pages/
│   ├── _app.js          # Global stiller ve fontlar
│   └── index.js         # Ana uygulama
├── public/              # Statik dosyalar
├── package.json
├── next.config.js
└── .gitignore
```

## 🔧 Lokalde Çalıştırma
```bash
npm install
npm run dev
# http://localhost:3000
```

## © 2026 HayrAI - Ardahan Üniversitesi

import { useState, useRef, useEffect } from "react";

const PLANS=[{id:"free",name:"Ücretsiz",price:"0₺",period:"",feat:["Günlük 3 sorgu","Filigranlı PDF","Temel rehberlik"],cta:"Başla",hl:false},{id:"monthly",name:"Aylık Premium",price:"149₺",period:"/ay",feat:["Sınırsız sorgu","Filigranlı PDF indirme","Gelişmiş metodoloji","İstatistik desteği","Analiz modu","Öncelikli yanıt"],cta:"Abone Ol",hl:true,badge:"En Popüler"},{id:"single",name:"Tek Makale",price:"299₺",period:"/adet",feat:["1 makale","Filigransız Word","Revizyon desteği"],cta:"Satın Al",hl:false},{id:"corp",name:"Kurumsal",price:"İletişim",period:"",feat:["Sınırsız kullanıcı","Üniversite entegrasyonu","Özel API","Yönetim paneli","Destek","Fatura"],cta:"Teklif Al",hl:false,badge:"ÜNİVERSİTELER"}];
const DEPTS=["Eğitim Bilimleri","İşletme","İktisat","Sosyoloji","Psikoloji","İletişim","Hukuk","Siyaset Bilimi","Tarih","Uluslararası İlişkiler","Turizm","Sosyal Hizmet","Diğer"];
const JRNLS=["Belirtmek İstemiyorum","Sosyal Politika Çalışmaları Dergisi","Eğitim ve Bilim","Turkish Journal of Education","Hacettepe Eğitim Fak. Dergisi","Türk Psikoloji Dergisi","Uluslararası Dergi","Diğer"];
const METHS=[{id:"quantitative",label:"Nicel",icon:"📊"},{id:"qualitative",label:"Nitel",icon:"🔍"},{id:"mixed",label:"Karma",icon:"🔀"},{id:"systematic",label:"Sistematik Derleme",icon:"📚"},{id:"meta",label:"Meta-Analiz",icon:"📈"},{id:"case",label:"Örnek Olay",icon:"🔬"}];
const DTOOLS=[{id:"survey",label:"Anket/Ölçek"},{id:"interview",label:"Görüşme"},{id:"observation",label:"Gözlem"},{id:"document",label:"Doküman Analizi"},{id:"experiment",label:"Deney"},{id:"focus",label:"Odak Grup"},{id:"secondary",label:"İkincil Veri"}];
const CITES=["APA 7","APA 6","IEEE","Chicago","Harvard","Vancouver"];
const SMPL=["Sosyal medya kullanımının akademik başarıya etkisi","Uzaktan eğitimde yapay zekâ destekli öğrenme","Kadın girişimciliğin ekonomik kalkınmaya katkısı"];
const AN_TYPES=[{id:"test",icon:"🧪",label:"İstatistik Test",desc:"Uygun testi bulun"},{id:"sample",icon:"📐",label:"Örneklem",desc:"Doğru büyüklük"},{id:"interpret",icon:"📊",label:"Yorumlama",desc:"p, d, r²"},{id:"design",icon:"🏗️",label:"Desen",desc:"Uygun desen"}];
const VAR_T=["Sürekli (Ölçek/Oran)","Sıralı (Ordinal)","Kategorik (Nominal)","İkili (Dichotomous)"];
const GRP_O=["1 grup","2 bağımsız grup","2 bağımlı grup (tekrarlı)","3+ bağımsız grup","3+ bağımlı grup"];

const IMG={hero:"https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&q=80",students:"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80",library:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&q=80",problem:"https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",campus:"https://images.unsplash.com/photo-1562774053-701939374585?w=900&q=80",profGroup:"https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&q=80",av1:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",av2:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",av3:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",av4:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80",av5:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",av6:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"};

const TESTIMONIALS=[
  {name:"Prof. Dr. Mehmet T.",role:"Profesör, İşletme",text:"Doktora öğrencilerime makale yapısını öğretmek için kullanıyorum. Etik uyarı sistemi çok yerinde.",avatar:IMG.av3,senior:true},
  {name:"Elif K.",role:"Araş. Gör., Eğitim Bilimleri",text:"İlk makalemde metodoloji konusunda çok zorlanıyordum. HayrAI ile hangi testi kullanacağımı öğrendim.",avatar:IMG.av1},
  {name:"Doç. Dr. Ayşe B.",role:"Doçent, Psikoloji",text:"Genç araştırmacıların yayın süreçlerini hızlandırmak için kurumsal lisans almayı planlıyoruz.",avatar:IMG.av4,senior:true},
  {name:"Ahmet Y.",role:"Doktora Öğrencisi, İktisat",text:"Danışmanım başka şehirde, HayrAI büyük boşluğu dolduruyor. Örneklem hesaplama aracı harika.",avatar:IMG.av2},
  {name:"Prof. Dr. Hasan Ö.",role:"Profesör, Sosyoloji",text:"'Kendiniz yazın' demesi pedagojik açıdan çok doğru. Öğrencilere hem yapı hem etik öğretiyor.",avatar:IMG.av5,senior:true},
  {name:"Zeynep A.",role:"Yüksek Lisans, İletişim",text:"Tez konumu belirledim ama yöntem seçemedim. Araştırma deseni rehberi hayat kurtardı.",avatar:IMG.av6}
];

/* ═══ ÖRNEK MAKALELER ═══ */
const EXAMPLE_ARTICLES=[
{id:1,type:"detailed",badge:"Nicel Araştırma",badgeColor:"#2b7cc9",
meta:{dept:"Eğitim Bilimleri",meth:"Nicel",cite:"APA 7"},
title:"Üniversite Öğrencilerinin Yapay Zekâ Okuryazarlık Düzeylerinin Akademik Öz-Yeterlik İnançlarına Etkisi: Türkiye Örneklemi",
abstract:"Bu araştırma, üniversite öğrencilerinin yapay zekâ okuryazarlık düzeyleri ile akademik öz-yeterlik inançları arasındaki ilişkiyi incelemektedir. Tarama modeline dayalı nicel çalışmada, Türkiye'nin yedi coğrafi bölgesinden 12 üniversitede öğrenim gören 1.240 lisans öğrencisinden anket yoluyla veri toplanmıştır. Verilerin analizinde betimsel istatistikler, Pearson korelasyon ve çoklu regresyon analizi kullanılmıştır. Bulgular, yapay zekâ okuryazarlığı ile akademik öz-yeterlik arasında pozitif yönde anlamlı bir ilişki olduğunu göstermektedir.",
kw:["Yapay zekâ okuryazarlığı","Akademik öz-yeterlik","Üniversite öğrencileri","Dijital yetkinlik","Türkiye"],
secs:[
{t:"1. GİRİŞ",c:`Yapay zekâ (YZ) teknolojileri, 21. yüzyılda eğitim ekosistemini köklü biçimde dönüştürmektedir. UNESCO'nun (2021) raporuna göre, YZ okuryazarlığı artık temel dijital yetkinlikler arasında değerlendirilmektedir. Türkiye'de ise üniversite öğrencilerinin YZ okuryazarlık düzeyleri ile akademik performansları arasındaki ilişki henüz yeterince araştırılmamıştır.

Bandura'nın (1997) Sosyal Bilişsel Kuramı çerçevesinde, bireylerin akademik öz-yeterlik inançları, öğrenme süreçlerindeki motivasyon ve başarıyı doğrudan etkileyen kritik bir değişkendir. YZ araçlarını etkin kullanabilen öğrencilerin akademik öz-yeterlik inançlarının daha yüksek olacağı varsayılmaktadır.

Bu araştırmanın amacı, üniversite öğrencilerinin YZ okuryazarlık düzeyleri ile akademik öz-yeterlik inançları arasındaki ilişkiyi incelemek ve YZ okuryazarlığının akademik öz-yeterliği yordama gücünü belirlemektir.

Hipotezler:
H1: YZ okuryazarlığı ile akademik öz-yeterlik arasında pozitif yönde anlamlı bir ilişki vardır.
H2: YZ okuryazarlığının alt boyutları, akademik öz-yeterliği anlamlı düzeyde yordamaktadır.`},
{t:"2. KAVRAMSAL ÇERÇEVE",c:`2.1. Yapay Zekâ Okuryazarlığı
Long ve Magerko (2020) YZ okuryazarlığını, "bireylerin YZ teknolojilerini eleştirel biçimde değerlendirme, etkin kullanma ve toplumsal etkilerini anlama yetkinliği" olarak tanımlamaktadır. Ng vd. (2021) ise bu kavramı bilme-anlama, kullanma-uygulama, değerlendirme-yaratma ve etik olmak üzere dört alt boyutta ele almıştır.

2.2. Akademik Öz-Yeterlik
Bandura'nın (1997) öz-yeterlik kuramına göre, akademik öz-yeterlik bireyin akademik görevleri başarıyla tamamlayabileceğine dair inancıdır. Jerusalem ve Schwarzer (1981) tarafından geliştirilen ölçek, bu alanda en yaygın kullanılan araçtır.

2.3. İlgili Araştırmalar
Uluslararası literatürde Chai vd. (2021) ve Carolus vd. (2023) YZ okuryazarlığının öğrenme çıktılarıyla ilişkisini incelerken, Türkiye'de bu alandaki çalışmalar sınırlı kalmıştır. Yıldız ve Karataş (2024) Türk üniversite öğrencilerinin YZ farkındalık düzeyini incelemiş ancak akademik öz-yeterlik ilişkisini ele almamıştır.`},
{t:"3. YÖNTEM",c:`3.1. Araştırma Modeli
İlişkisel tarama modeline dayalı nicel araştırma deseni kullanılmıştır (Karasar, 2020).

3.2. Evren ve Örneklem
Araştırmanın evrenini Türkiye'deki devlet üniversitelerinde öğrenim gören lisans öğrencileri oluşturmaktadır. Tabakalı rastgele örnekleme yöntemiyle 7 bölgeden 12 üniversite seçilmiş, toplam 1.240 öğrenciye ulaşılmıştır. Örneklem büyüklüğü G*Power 3.1 ile hesaplanmıştır (f² = 0.02, α = .05, power = .95).

3.3. Veri Toplama Araçları
(a) YZ Okuryazarlık Ölçeği (Ng vd., 2021; Türkçe uyarlama: Yılmaz & Kaya, 2023): 4 alt boyut, 24 madde, 5'li Likert. Cronbach α = .91
(b) Akademik Öz-Yeterlik Ölçeği (Jerusalem & Schwarzer, 1981; Türkçe uyarlama: Yılmaz vd., 2007): 7 madde. α = .87
(c) Kişisel Bilgi Formu: Cinsiyet, sınıf, bölüm, YZ araç kullanım sıklığı.

3.4. Verilerin Analizi
SPSS 28.0 ve AMOS 24 kullanılmıştır.
- Normallik: Kolmogorov-Smirnov, çarpıklık/basıklık (±1.5)
- Betimsel istatistikler (ortalama, SS)
- Pearson korelasyon analizi
- Çoklu doğrusal regresyon analizi (Enter yöntemi)
- DFA ile ölçek geçerliği teyidi

3.5. Etik
Üniversite Etik Kurulu onayı alınmıştır (Karar No: 2025/04-12). Katılımcılardan bilgilendirilmiş onam formu alınmıştır.`},
{t:"4. BULGULAR",c:`4.1. Betimsel İstatistikler

Tablo 1. Betimsel İstatistikler
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Değişken                      N      X̄     SS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YZ Okuryazarlık (Toplam)    1240   3.42   0.71
  Bilme-Anlama              1240   3.68   0.79
  Kullanma-Uygulama         1240   3.21   0.84
  Değerlendirme-Yaratma     1240   3.15   0.91
  Etik Farkındalık          1240   3.64   0.76
Akademik Öz-Yeterlik       1240   3.57   0.68
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Katılımcıların %56'sı kadın, %44'ü erkektir. %38'i günlük, %42'si haftalık YZ araç kullanmaktadır.

4.2. Korelasyon Analizi

Tablo 2. Pearson Korelasyon Matrisi
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              1      2      3      4      5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Bilme      -
2. Kullanma  .62**   -
3. Değerl.   .54** .71**   -
4. Etik      .48** .39** .42**   -
5. Öz-Yet.   .41** .52** .47** .36**   -
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
** p < .01

YZ okuryazarlığı toplam puanı ile akademik öz-yeterlik arasında orta düzeyde pozitif korelasyon saptanmıştır (r = .54, p < .001). H1 desteklenmiştir.

4.3. Regresyon Analizi

Tablo 3. Çoklu Regresyon Analizi Sonuçları
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Yordayıcı               B     SE     β      t       p
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(Sabit)               1.42   0.12    -    11.83   .000
Bilme-Anlama          0.08   0.03   .09    2.67   .008
Kullanma-Uygulama     0.24   0.03   .30    8.00   .000
Değerlendirme-Yaratma 0.17   0.03   .23    5.67   .000
Etik Farkındalık      0.11   0.03   .12    3.67   .000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
R = .58, R² = .34, Düz. R² = .33
F(4, 1235) = 157.42, p < .001

Model, akademik öz-yeterlikteki varyansın %34'ünü açıklamaktadır. En güçlü yordayıcı "Kullanma-Uygulama" alt boyutudur (β = .30, p < .001). H2 desteklenmiştir.`},
{t:"5. TARTIŞMA VE SONUÇ",c:`Araştırma bulguları, YZ okuryazarlığı ile akademik öz-yeterlik arasında anlamlı pozitif ilişki olduğunu ortaya koymaktadır. Bu bulgu, Chai vd. (2021) ve Carolus vd. (2023) ile tutarlıdır.

En güçlü yordayıcının "Kullanma-Uygulama" boyutu olması, YZ araçlarını aktif kullanan öğrencilerin akademik görevlerde daha yüksek öz-yeterlik geliştirdiğini göstermektedir. Bu, Bandura'nın (1997) "performans başarıları" kaynağıyla örtüşmektedir.

Öneriler:
• Üniversitelerde YZ okuryazarlık dersleri müfredata entegre edilmelidir
• YZ araçlarının etik kullanımı konusunda farkındalık programları düzenlenmelidir
• Boylamsal çalışmalarla nedensellik ilişkileri incelenmelidir

Sınırlılıklar: Kesitsel desen, öz-bildirime dayalı veriler, devlet üniversiteleriyle sınırlılık.`},
{t:"KAYNAKÇA",c:`Bandura, A. (1997). Self-efficacy: The exercise of control. Freeman.
Carolus, A., vd. (2023). AI literacy. Computers and Education: AI, 4, 100131.
Chai, C. S., vd. (2021). Perceptions of AI. BJET, 52(5), 1893-1909.
Karasar, N. (2020). Bilimsel araştırma yöntemi (36. baskı). Nobel.
Long, D., & Magerko, B. (2020). What is AI literacy? CHI 2020 (pp. 1-16). ACM.
Ng, D. T. K., vd. (2021). AI literacy: Definition and design. CAEO, 2, 100041.
UNESCO. (2021). AI and education: Guidance for policy-makers. UNESCO.
Yılmaz, M., vd. (2007). Akademik öz-yeterlik ölçeği. Hacettepe Eğitim Fak., 33, 253-259.`}
]},
{id:2,type:"detailed",badge:"Nitel Araştırma",badgeColor:"#16a34a",
meta:{dept:"Sosyoloji",meth:"Nitel",cite:"APA 7"},
title:"Türkiye'de Uzaktan Çalışmanın Kadın Akademisyenlerin İş-Yaşam Dengesi Üzerindeki Etkileri: Fenomenolojik Bir Araştırma",
abstract:"Bu fenomenolojik araştırma, COVID-19 sonrası dönemde uzaktan çalışma uygulamalarının Türkiye'deki kadın akademisyenlerin iş-yaşam dengesi deneyimlerine etkisini derinlemesine incelemektedir. Araştırmada, farklı üniversitelerden 22 kadın akademisyenle yarı yapılandırılmış görüşmeler gerçekleştirilmiştir. Veriler tematik analiz yöntemiyle çözümlenmiş, bulgular 4 ana tema ve 14 alt tema altında sunulmuştur.",
kw:["Uzaktan çalışma","Kadın akademisyenler","İş-yaşam dengesi","Fenomenoloji","COVID-19 sonrası"],
secs:[
{t:"1. GİRİŞ",c:`COVID-19 pandemisi, akademik çalışma biçimlerini kalıcı olarak dönüştürmüştür. Uzaktan çalışma, pandemi öncesinde sınırlı düzeyde uygulanan bir çalışma modeli iken, pandemi sonrasında hibrit ve tam uzaktan çalışma modelleri birçok üniversitede kalıcı hâle gelmiştir (Watermeyer vd., 2021).

Bu dönüşümün kadın akademisyenler üzerindeki etkileri, toplumsal cinsiyet perspektifinden özellikle incelenmesi gereken bir konudur. Araştırmalar, pandemi sürecinde kadın akademisyenlerin erkek meslektaşlarına kıyasla daha fazla ev içi sorumluluk üstlendiğini ve yayın üretkenliklerinin daha fazla etkilendiğini ortaya koymaktadır (Minello vd., 2021).

Bu araştırmanın amacı, uzaktan çalışmanın Türkiye'deki kadın akademisyenlerin iş-yaşam dengesi deneyimlerine etkisini fenomenolojik yaklaşımla derinlemesine anlamaktır.

Araştırma soruları:
1. Kadın akademisyenler uzaktan çalışma sürecinde iş-yaşam dengesini nasıl deneyimlemektedir?
2. Bu deneyimleri şekillendiren bireysel, kurumsal ve toplumsal faktörler nelerdir?
3. Kadın akademisyenler hangi başa çıkma stratejilerini geliştirmiştir?`},
{t:"2. KAVRAMSAL ÇERÇEVE",c:`2.1. Uzaktan Çalışma ve Akademi
Uzaktan çalışma, çalışanların fiziksel iş yerinden bağımsız olarak görevlerini yerine getirmesi olarak tanımlanmaktadır (Eurofound & ILO, 2017). Akademik bağlamda bu kavram, araştırma, eğitim ve idari görevlerin dijital ortamda yürütülmesini kapsamaktadır.

2.2. İş-Yaşam Dengesi
Greenhaus ve Allen (2011) iş-yaşam dengesini, "bireyin iş ve yaşam rollerindeki etkinliğinin ve memnuniyetinin birbiriyle uyumlu olması" şeklinde tanımlamaktadır. Sınır kuramı (boundary theory), bireylerin iş ve özel yaşam alanları arasındaki sınırları nasıl yönettiğini açıklamaktadır (Ashforth vd., 2000).

2.3. Toplumsal Cinsiyet ve Akademik Kariyer
Türkiye'de kadın akademisyenler, YÖK (2024) verilerine göre toplam akademik personelin %45'ini oluşturmaktadır. Ancak profesör unvanında bu oran %32'ye düşmektedir ("cam tavan" etkisi). Uzaktan çalışmanın bu eşitsizliği derinleştirme ya da hafifletme potansiyeli tartışmalıdır.`},
{t:"3. YÖNTEM",c:`3.1. Araştırma Deseni
Moustakas'ın (1994) transandantal fenomenolojik yaklaşımı benimsenmiştir. Bu desen, katılımcıların yaşanmış deneyimlerinin özüne ulaşmayı amaçlamaktadır.

3.2. Çalışma Grubu
Amaçlı örnekleme yöntemlerinden maksimum çeşitlilik örneklemesi kullanılmıştır (Patton, 2015). Katılımcı kriterleri: (a) kadın akademisyen, (b) en az 1 yıl uzaktan/hibrit çalışma deneyimi, (c) çocuk sahibi olma.

Tablo 1. Katılımcı Profili
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Kod   Unvan           Çocuk  Deneyim
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
K1    Prof. Dr.        2     22 yıl
K2    Doç. Dr.         1     14 yıl
K3    Dr. Öğr. Üy.     3     9 yıl
K4    Araş. Gör. Dr.   1     6 yıl
...   (toplam 22 katılımcı)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3.3. Veri Toplama
Yarı yapılandırılmış görüşme formu, uzman görüşleri ve pilot uygulama sonrası revize edilmiştir. Görüşmeler çevrimiçi (Zoom) ve yüz yüze gerçekleştirilmiş, ortalama 55 dakika sürmüştür. Katılımcı izniyle ses kaydı alınmıştır.

3.4. Veri Analizi
Braun ve Clarke'ın (2006) altı aşamalı tematik analiz yöntemi uygulanmıştır. MAXQDA 2024 yazılımı kullanılmıştır. İki bağımsız kodlayıcı arası güvenirlik Miles ve Huberman formülüyle %89 olarak hesaplanmıştır.

3.5. Geçerlik ve Güvenirlik
İnandırıcılık: Katılımcı teyidi, uzun süreli etkileşim
Aktarılabilirlik: Ayrıntılı betimleme
Tutarlılık: Dış denetim
(Lincoln & Guba, 1985)

3.6. Etik
Etik Kurul onayı (2025/02-08). Gönüllülük, gizlilik ve aydınlatılmış onam sağlanmıştır.`},
{t:"4. BULGULAR",c:`Tematik analiz sonucunda 4 ana tema ve 14 alt tema belirlenmiştir.

Tablo 2. Tema Yapısı
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ana Tema                     Alt Tema                    f
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Sınır Bulanıklığı         Mekânsal iç içe geçme      20
                              Zamansal belirsizlik       18
                              Rol çatışması              22
                              "Her an erişilebilir" baskısı 16
2. Görünmez Emek             Ev içi sorumluluk artışı   21
                              Duygusal emek              15
                              Teknolojik bakım emeği     12
3. Akademik Üretkenlik       Araştırma zamanı paradoksu  19
                              Yayın baskısı ve suçluluk  17
                              Çevrimiçi eğitim yükü     20
4. Direniş ve Adaptasyon    Mikro-sınır stratejileri    18
                              Dayanışma ağları           14
                              Yeniden anlamlandırma       11
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.1. Tema 1: Sınır Bulanıklığı
Katılımcıların büyük çoğunluğu (n=20) iş ve ev alanlarının mekânsal olarak iç içe geçmesinin en büyük zorluk olduğunu ifade etmiştir.

K3 (Dr. Öğr. Üyesi, 3 çocuk): "Mutfak masası hem yemek masası, hem ofis masası, hem çocukların ödev masası oldu. Hangi rolde olduğumu bile unutuyordum bazen."

K7 (Doç. Dr., 2 çocuk): "Toplantıdayken çocuk ağlıyor, makale yazarken yemek kaynıyor. Zihinsel olarak hiçbir yerde tam olamıyorsun."

4.2. Tema 2: Görünmez Emek
Ev içi sorumlulukların pandemi sürecinde belirgin biçimde arttığı, bu artışın kalıcılaştığı ifade edilmiştir (n=21).

K12 (Prof. Dr., 2 çocuk): "Eşim de evden çalışıyor ama yemek, çamaşır, çocukların okul takibi hep bende. Bu 'ikinci mesai' hiç bitmedi."

4.3. Tema 3: Akademik Üretkenlik
"Araştırma zamanı paradoksu" özellikle çarpıcıdır: Uzaktan çalışma teorik olarak daha fazla araştırma zamanı yaratsa da, pratikte bu zaman ev sorumlulukları tarafından emilmektedir (n=19).

K5 (Araş. Gör. Dr., 1 çocuk): "Evdeyim ama yazamıyorum. Ofiste saatlerim sınırlıydı ama verimliydim. Şimdi 24 saat 'çalışıyorum' ama bir satır yazamıyorum."

4.4. Tema 4: Direniş ve Adaptasyon
Katılımcılar zamanla çeşitli başa çıkma stratejileri geliştirmiştir. "Mikro-sınır stratejileri" (n=18) — belirli saatlerde kapıyı kapatma, kulaklık takma, "çalışma modu" ritüelleri oluşturma — en yaygın adaptasyon mekanizmasıdır.`},
{t:"5. TARTIŞMA VE SONUÇ",c:`Bulgular, uzaktan çalışmanın kadın akademisyenler için hem fırsatlar hem de önemli zorluklar yarattığını ortaya koymaktadır. Sınır bulanıklığı teması, Ashforth vd. (2000) sınır kuramı ile tutarlıdır. Görünmez emek bulguları, Minello vd. (2021) ve Staniscuaski vd. (2021) ile örtüşmektedir.

Öneriler:
• Üniversiteler esnek çalışma politikalarını toplumsal cinsiyet perspektifinden yeniden değerlendirmelidir
• Kurumsal düzeyde çocuk bakım desteği sağlanmalıdır
• Kadın akademisyenler için mentorluk ve dayanışma ağları güçlendirilmelidir

Sınırlılıklar: Yalnızca çocuklu kadın akademisyenlerle sınırlıdır. Erkek akademisyenlerin perspektifi karşılaştırmalı olarak incelenmemiştir.`},
{t:"KAYNAKÇA",c:`Ashforth, B. E., vd. (2000). All in a day's work. Academy of Management Review, 25(3), 472-491.
Braun, V., & Clarke, V. (2006). Qualitative Research in Psychology, 3(2), 77-101.
Eurofound & ILO. (2017). Working anytime, anywhere. Publications Office of the EU.
Greenhaus, J. H., & Allen, T. D. (2011). Work–family balance. In J. C. Quick & L. E. Tetrick (Eds.), Handbook of occupational health psychology (pp. 165-183). APA.
Lincoln, Y. S., & Guba, E. G. (1985). Naturalistic inquiry. Sage.
Minello, A., vd. (2021). The pandemic and the academic mothers. European Societies, 23(sup1), S651-S664.
Moustakas, C. (1994). Phenomenological research methods. Sage.
Patton, M. Q. (2015). Qualitative research & evaluation methods (4th ed.). Sage.
Watermeyer, R., vd. (2021). COVID-19 and digital disruption. BJET, 52(1), 5-19.
YÖK. (2024). Yükseköğretim İstatistikleri. https://istatistik.yok.gov.tr`}
]}
];

function getTests(q){const{depVar,groups,normal}=q;const n=parseInt(q.sampleSize)||30;const isN=normal==="Evet";const isCont=depVar==="Sürekli (Ölçek/Oran)";const isCat=depVar==="Kategorik (Nominal)"||depVar==="İkili (Dichotomous)";const isOrd=depVar==="Sıralı (Ordinal)";if(isCont&&groups==="2 bağımsız grup")return isN?[{name:"Bağımsız t-Testi",soft:"SPSS: Analyze → Compare Means → Independent Samples T-Test",why:"İki grup ortalaması.",report:`t(${n-2})=[d], p=[d], d=[d]`}]:[{name:"Mann-Whitney U",soft:"SPSS: Nonparametric → 2 Independent",why:"Normallik yok.",report:"U=[d], z=[d], p=[d]"}];if(isCont&&groups==="3+ bağımsız grup")return isN?[{name:"Tek Yönlü ANOVA",soft:"SPSS: Compare Means → One-Way ANOVA",why:"3+ grup.",report:`F(2,${n-3})=[d], p=[d], η²=[d]`}]:[{name:"Kruskal-Wallis H",soft:"SPSS: Nonparametric → K Independent",why:"Normallik yok.",report:"H(df)=[d], p=[d]"}];if(isCat)return[{name:"Ki-Kare (χ²)",soft:"SPSS: Crosstabs",why:"Kategorik ilişki.",report:"χ²(df)=[d], p=[d], V=[d]"}];if(isCont&&groups==="1 grup")return[{name:"Pearson Korelasyon",soft:"SPSS: Correlate → Bivariate",why:"Sürekli ilişki.",report:"r=[d], p=[d]"},{name:"Çoklu Regresyon",soft:"SPSS: Regression → Linear",why:"Yordama.",report:"R²=[d], F=[d], p=[d]"}];if(isOrd)return[{name:"Spearman",soft:"SPSS: Correlate → Bivariate (Spearman)",why:"Sıralı.",report:"rs=[d], p=[d]"}];return[{name:"Korelasyon/Regresyon",soft:"Değişkene göre.",why:"Genel."}];}
function calcSample(q){const z=q.confidence==="95"?1.96:q.confidence==="99"?2.576:1.645;const d=q.effect==="small"?0.2:q.effect==="medium"?0.5:0.8;const pw=q.power==="80"?0.84:q.power==="90"?1.28:0.67;const n=Math.ceil(((z+pw)/d)**2);return{n,formula:`n=((${z}+${pw})/${d})²≈${n}`,note:`%${q.confidence} güven, ${d} etki, %${q.power} güç → min ${n}. Kayıp için ${Math.ceil(n*1.15)} hedefleyin.`};}
function genQuick(t){return{type:"quick",title:`${t}: Sistematik Bir İnceleme`,
abstract:`Bu çalışma, "${t.toLowerCase()}" konusunu sistematik derleme yöntemiyle ele almaktadır. PRISMA 2020 rehberi doğrultusunda yürütülen araştırmada, Web of Science, Scopus, ERIC ve TR Dizin veri tabanlarında kapsamlı tarama yapılmıştır. Dahil etme ve dışlama kriterleri uygulandıktan sonra toplam 68 çalışma analize dahil edilmiştir. Tematik analiz sonucunda dört ana tema belirlenmiştir. Bulgular, konunun çok boyutlu bir yapıya sahip olduğunu ortaya koymaktadır.`,
kw:["Sistematik derleme",t.split(" ").slice(0,3).join(" "),"Türkiye","Tematik analiz","PRISMA 2020"],
secs:[
{t:"1. GİRİŞ",c:`${t} konusu, son yıllarda hem ulusal hem de uluslararası akademik çevrelerde artan bir ilgiyle karşılanmaktadır. Küreselleşme, dijitalleşme ve toplumsal dönüşüm süreçlerinin etkisiyle bu alandaki araştırmaların önemi giderek artmaktadır (Creswell & Creswell, 2018).\n\nTürkiye özelinde değerlendirildiğinde, konu hem politika düzeyinde hem de uygulama düzeyinde kritik bir yere sahiptir. YÖK (2024) verilerine göre, ilgili alanda son beş yılda gerçekleştirilen tez ve makale sayısında belirgin bir artış gözlemlenmektedir. Ancak mevcut çalışmaların büyük çoğunluğu nicel yöntemlerle yürütülmüş olup, nitel ve karma yöntem araştırmalarının görece sınırlı kaldığı dikkat çekmektedir (Karasar, 2020).\n\nBu çalışmanın temel amacı, "${t.toLowerCase()}" konusundaki mevcut literatürü sistematik olarak incelemek, temel bulguları sentezlemek ve gelecekteki araştırmalara yol göstermektir. Araştırma, PRISMA 2020 rehberi doğrultusunda yürütülmüştür (Page vd., 2021).\n\nAraştırmanın alt amaçları:\n• Ulusal ve uluslararası literatürün kapsamlı taranması\n• Bulguların tematik analiz yoluyla sentezlenmesi\n• Metodolojik eğilimlerin ve araştırma boşluklarının tespiti\n• Araştırmacılar ve politika yapıcılar için öneriler geliştirilmesi`},
{t:"2. KAVRAMSAL ÇERÇEVE",c:`2.1. Temel Kavramlar\n${t} konusuyla ilişkili temel kavramlar, ilgili alan yazın çerçevesinde tanımlanmış ve operasyonel hâle getirilmiştir. Kavramsal sınırların net biçimde çizilmesi, sistematik derlemenin kapsamının belirlenmesinde kritik bir rol üstlenmiştir.\n\n2.2. Kuramsal Altyapı\nÇalışmanın kuramsal temeli, sosyal yapılandırmacılık (Vygotsky, 1978), teknoloji kabul modeli (Davis, 1989) ve yenilik yayılımı kuramı (Rogers, 2003) üzerine inşa edilmiştir. Bu kuramsal çerçeve, araştırma sorularının formüle edilmesinde ve bulguların yorumlanmasında rehberlik etmektedir.\n\n2.3. İlgili Araştırmalar\nUlusal düzeyde, konuyla ilgili çalışmalar ağırlıklı olarak eğitim bilimleri, sosyoloji ve psikoloji alanlarında yoğunlaşmaktadır. Uluslararası literatürde ise farklı kültürel bağlamlarda karşılaştırmalı bulgular sunulmuştur. Mevcut literatürde dikkat çeken boşluklar: (a) boylamsal çalışmaların yetersizliği, (b) karma yöntem araştırmalarının sınırlılığı, (c) Türkiye bağlamında kültürel faktörlerin yeterince incelenmemesi.`},
{t:"3. YÖNTEM",c:`3.1. Araştırma Deseni\nPRISMA 2020 rehberi takip edilmiştir (Page vd., 2021).\n\n3.2. Tarama Stratejisi\nWeb of Science, Scopus, ERIC, TR Dizin, ULAKBİM ve Google Scholar veri tabanlarında tarama yapılmıştır. Tarama 2015-2025 dönemiyle sınırlandırılmıştır. Boolean operatörleri (AND, OR, NOT) ile kombinasyonlar oluşturulmuştur.\n\n3.3. Dahil Etme ve Dışlama Kriterleri\nDahil: (a) Hakemli dergi, (b) 2015-2025, (c) Konuyla doğrudan ilişkili, (d) Türkçe/İngilizce, (e) Ampirik.\nDışlama: (a) Kitap bölümleri, (b) Konferans özetleri, (c) Tam metin erişilemeyen.\n\n3.4. Kalite Değerlendirmesi\nMMAT (Hong vd., 2018) ile metodolojik kalite değerlendirilmiştir.\n\n3.5. Veri Analizi\nTematik sentez yöntemi (Thomas & Harden, 2008). İki bağımsız kodlayıcı, Cohen's Kappa = 0.87 ("mükemmel uyum").`},
{t:"4. BULGULAR",c:`4.1. Tarama Süreci\nToplam 2.384 kayıt → mükerrer çıkarma (n=712) → 1.672 başlık/özet tarama → 156 tam metin → 68 çalışma dahil.\n\n4.2. Çalışmaların Genel Özellikleri\n\nTablo 1. Dahil Edilen Çalışmalar\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nÖzellik                    n     %\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nYöntem\n  Nicel                   31   45.6\n  Nitel                   20   29.4\n  Karma                   17   25.0\nYayın Yılı\n  2015-2019               22   32.4\n  2020-2025               46   67.6\nÜlke\n  Türkiye                 28   41.2\n  ABD/Kanada              14   20.6\n  Avrupa                  18   26.5\n  Diğer                    8   11.7\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n%67.6'sının 2020 sonrası olması konuya artan ilgiyi göstermektedir.\n\n4.3. Tematik Bulgular\n4 ana tema, 12 alt tema belirlenmiştir:\n\nTema 1: Bireysel Faktörler — Demografik özellikler, tutumlar, motivasyon ve öz-yeterlik (n=42).\nTema 2: Kurumsal Dinamikler — Örgütsel yapı, liderlik, kurumsal politikalar (n=35).\nTema 3: Teknolojik Faktörler — Dijital altyapı, teknoloji erişimi, YZ uygulamaları (n=29).\nTema 4: Toplumsal Bağlam — Kültürel normlar, sosyoekonomik koşullar, politika çerçeveleri (n=24).`},
{t:"5. TARTIŞMA VE SONUÇ",c:`5.1. Tartışma\nBulgular, konunun çok boyutlu ve dinamik bir yapıya sahip olduğunu ortaya koymaktadır. Bireysel, kurumsal, teknolojik ve toplumsal faktörlerin karmaşık etkileşim örüntüleri sergilediği belirlenmiştir. Bu bulgu, ekolojik sistemler kuramıyla (Bronfenbrenner, 1979) uyumludur.\n\nÇalışmaların %67.6'sının 2020 sonrası olması, COVID-19'un araştırma gündemini yeniden şekillendirdiğini göstermektedir.\n\n5.2. Öneriler\nAraştırmacılara:\n• Boylamsal ve karma yöntem araştırmalarının artırılması\n• Farklı kültürel bağlamlarda karşılaştırmalı çalışmalar\n• Yapay zekâ ve dijital dönüşüm boyutunun incelenmesi\n\nPolitika yapıcılara:\n• Kanıta dayalı politika geliştirme\n• Kurumsal destek mekanizmalarının güçlendirilmesi\n\n5.3. Sınırlılıklar\nMeta-analiz içermemektedir. Yalnızca belirli veri tabanları ve Türkçe-İngilizce çalışmalar dahil edilmiştir.`},
{t:"KAYNAKÇA",c:`Bronfenbrenner, U. (1979). The ecology of human development. Harvard University Press.\nCreswell, J. W., & Creswell, J. D. (2018). Research design (5th ed.). Sage.\nDavis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. MIS Quarterly, 13(3), 319-340.\nHong, Q. N., vd. (2018). Mixed Methods Appraisal Tool (MMAT). Education for Information, 34(4), 285-291.\nKarasar, N. (2020). Bilimsel araştırma yöntemi (36. baskı). Nobel.\nPage, M. J., vd. (2021). The PRISMA 2020 statement. BMJ, 372, n71.\nRogers, E. M. (2003). Diffusion of innovations (5th ed.). Free Press.\nThomas, J., & Harden, A. (2008). Methods for thematic synthesis. BMC Med Res Methodol, 8, 45.\nVygotsky, L. S. (1978). Mind in society. Harvard University Press.\nYÖK. (2024). Yükseköğretim istatistikleri. https://istatistik.yok.gov.tr`}
]};}

function genDetailed(f){const mL=METHS.find(m=>m.id===f.method)?.label||"Karma";const tools=f.dataTools.map(t=>DTOOLS.find(d=>d.id===t)?.label).join(", ");const s=f.sampleDesc||"araştırma katılımcıları";const isQuant=f.method==="quantitative";const isQual=f.method==="qualitative"||f.method==="case";
let mSec,fSec,refs;
if(isQuant){mSec=`3.1. Araştırma Modeli\n${f.dataTools.includes("experiment")?"Deneysel":"İlişkisel tarama"} modeline dayalı nicel araştırma deseni kullanılmıştır (Büyüköztürk, 2020).\n\n3.2. Evren ve Örneklem\nAraştırmanın evrenini ${f.department.toLowerCase()} alanındaki ${s} oluşturmaktadır. Örneklem büyüklüğü G*Power 3.1 yazılımıyla %95 güven düzeyinde hesaplanmıştır (Faul vd., 2009).\n\n3.3. Veri Toplama Araçları\n${f.dataTools.includes("survey")?"Araştırmada 5'li Likert tipi ölçek kullanılmıştır. Yapı geçerliği Doğrulayıcı Faktör Analizi (DFA) ile sınanmış, güvenirlik Cronbach alfa katsayısı ile hesaplanmıştır (α = .89).":"Veri toplama aracı olarak "+tools+" kullanılmıştır."}\n\n3.4. Verilerin Analizi\nSPSS 28.0 kullanılmıştır. Normallik varsayımı Kolmogorov-Smirnov ve Shapiro-Wilk testleriyle sınanmıştır. Çarpıklık ve basıklık değerleri ±1.5 aralığında olup parametrik testlerin uygulanmasına karar verilmiştir (Tabachnick & Fidell, 2019).\n${f.dataTools.includes("experiment")?"Gruplar arası farklar bağımsız örneklem t-testi ve tek yönlü ANOVA ile test edilmiştir. Etki büyüklüğü Cohen's d ile hesaplanmıştır.":"Değişkenler arası ilişkiler Pearson korelasyon, yordayıcı ilişkiler çoklu regresyon analizi ile incelenmiştir."}\n\n3.5. Etik Onay\nÜniversite Etik Kurulu onayı alınmıştır (Karar No: 2025/XX). Bilgilendirilmiş onam formu uygulanmıştır.`;
fSec=`4.1. Betimsel İstatistikler\n\nTablo 1. Betimsel İstatistikler\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nDeğişken            N      X̄      SS    Min   Max\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nBağımlı Değişken   400   3.82   0.74   1.20  5.00\nBağımsız Değ. 1    400   3.56   0.81   1.00  5.00\nBağımsız Değ. 2    400   3.91   0.69   1.40  5.00\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nKatılımcıların %54'ü kadın, %46'sı erkektir. Yaş ortalaması X̄ = 28.4 (SS = 6.2).\n\n4.2. Normallik Testi\nVeriler normal dağılım göstermektedir (p > .05). Çarpıklık ve basıklık ±1.5 aralığındadır.\n\n4.3. Hipotez Testleri\n${f.hypothesis?"Hipotez: \""+f.hypothesis+"\"\n\n":""}Regresyon analizi sonuçlarına göre model istatistiksel olarak anlamlıdır:\n\nTablo 2. Çoklu Regresyon Analizi\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nModel              B     SE     β      t       p\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSabit            1.24  0.18    —    6.89   .000\nBağımsız Değ. 1  0.42  0.06  .38   7.00   .000\nBağımsız Değ. 2  0.28  0.07  .22   4.00   .000\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nR² = .42, Düz. R² = .41, F(2, 397) = 28.63, p < .001\n\nModel, bağımlı değişkendeki varyansın %42'sini açıklamaktadır. En güçlü yordayıcı β = .38 ile birinci bağımsız değişkendir.`;
refs=`Büyüköztürk, Ş. (2020). Sosyal bilimler için veri analizi el kitabı (28. baskı). Pegem.\nFaul, F., Erdfelder, E., Buchner, A., & Lang, A.-G. (2009). G*Power 3.1. Behavior Research Methods, 41(4), 1149-1160.\nTabachnick, B. G., & Fidell, L. S. (2019). Using multivariate statistics (7th ed.). Pearson.`;}
else if(isQual){mSec=`3.1. Araştırma Deseni\n${f.method==="case"?"Örnek olay çalışması deseni (Yin, 2018)":"Fenomenolojik araştırma deseni (Moustakas, 1994)"} benimsenmiştir.\n\n3.2. Çalışma Grubu\n${s}. Amaçlı örnekleme yöntemlerinden ölçüt örnekleme kullanılmıştır (Patton, 2015). Veri doygunluğuna ulaşılıncaya kadar görüşmelere devam edilmiştir.\n\n3.3. Veri Toplama\n${f.dataTools.includes("interview")?"Yarı yapılandırılmış görüşme formu uzman görüşleri ve pilot uygulama sonrası revize edilmiştir. Görüşmeler ortalama 50 dakika sürmüş, katılımcı izniyle ses kaydına alınmıştır.":"Veri toplama aracı olarak "+tools+" kullanılmıştır."}\n\n3.4. Veri Analizi\nBraun ve Clarke'ın (2006) altı aşamalı tematik analiz yöntemi uygulanmıştır. MAXQDA 2024 yazılımı kullanılmıştır. İki bağımsız kodlayıcı arası güvenirlik Miles ve Huberman formülüyle %89 olarak hesaplanmıştır.\n\n3.5. Geçerlik ve Güvenirlik\nİnandırıcılık: Katılımcı teyidi, uzun süreli etkileşim, çeşitleme.\nAktarılabilirlik: Ayrıntılı betimleme (Lincoln & Guba, 1985).\n\n3.6. Etik\nEtik Kurul onayı (2025/XX). Gönüllülük, gizlilik sağlanmıştır.`;
fSec=`Tematik analiz sonucunda 4 ana tema ve 12 alt tema belirlenmiştir.\n\nTablo 1. Tema ve Alt Tema Dağılımı\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nAna Tema                  Alt Tema                  f\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n1. Bireysel Deneyimler    Motivasyon kaynakları     18\n                          Karşılaşılan zorluklar   24\n                          Başa çıkma stratejileri  15\n2. Kurumsal Dinamikler    Destek mekanizmaları      12\n                          Engeller ve sınırlılıklar 21\n                          Örgüt kültürü etkisi      9\n3. Teknolojik Boyut       Dijital araç kullanımı    16\n                          Erişim ve altyapı         11\n4. Toplumsal Bağlam       Kültürel normlar          13\n                          Sosyal destek ağları       8\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n4.1. Tema 1: Bireysel Deneyimler\nKatılımcıların büyük çoğunluğu (n=18) içsel motivasyonun belirleyici olduğunu ifade etmiştir.\n\nK3: \"Bu alanda çalışmaya başlamamın en büyük nedeni, konuya duyduğum kişisel ilgiydi. Dışarıdan baskılar değil, kendi merakım beni yönlendirdi.\"\n\nK7: \"Zorluklar elbette vardı, ama her zorluk aslında beni daha da motive etti. Sahada karşılaştığım deneyimler araştırmamın yönünü şekillendirdi.\"\n\n4.2. Tema 2: Kurumsal Dinamikler\nKatılımcıların yarısı (n=12) kurumsal desteği yeterli bulurken, diğer yarısı (n=21) çeşitli engeller belirtmiştir.\n\n4.3. Tema 3: Teknolojik Boyut\nDijital araç kullanımının katkısı sıklıkla vurgulanmıştır (n=16). Ancak erişim sorunlarının bu katkıyı sınırladığı da belirtilmiştir.`;
refs=`Braun, V., & Clarke, V. (2006). Using thematic analysis in psychology. Qualitative Research in Psychology, 3(2), 77-101.\nLincoln, Y. S., & Guba, E. G. (1985). Naturalistic inquiry. Sage.\nMoustakas, C. (1994). Phenomenological research methods. Sage.\nPatton, M. Q. (2015). Qualitative research & evaluation methods (4th ed.). Sage.\nYin, R. K. (2018). Case study research and applications (6th ed.). Sage.`;}
else{mSec=`3.1. Araştırma Deseni\nPRISMA 2020 rehberi doğrultusunda sistematik derleme (Page vd., 2021).\n\n3.2. Tarama\nWeb of Science, Scopus, ERIC, TR Dizin, ULAKBİM. 2015-2025.\n\n3.3. Dahil Etme/Dışlama\nDahil: Hakemli dergi, ampirik, ${f.department.toLowerCase()} ilişkili.\nDışlama: Kitap bölümleri, tezler, tam metin erişilemeyen.\n\n3.4. Analiz\nTematik sentez (Thomas & Harden, 2008). MMAT kalite değerlendirmesi. Cohen's Kappa = 0.87.`;
fSec=`2.384 kayıt tespit → 712 mükerrer çıkarma → 1.672 tarama → 156 tam metin → 72 dahil.\n\nTablo 1. Çalışmaların Özellikleri\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nÖzellik              n     %\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nNicel               40   55.6\nNitel               20   27.8\nKarma               12   16.7\n2015-2019           24   33.3\n2020-2025           48   66.7\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n%66.7'si 2020 sonrası, artan ilgiyi göstermektedir.\n\n3 ana tema: (1) Bireysel belirleyiciler, (2) Yapısal/kurumsal etkenler, (3) Teknolojik ve dijital boyut.`;
refs=`Page, M. J., vd. (2021). The PRISMA 2020 statement. BMJ, 372, n71.\nThomas, J., & Harden, A. (2008). Methods for thematic synthesis. BMC Med Res Methodol, 8, 45.`;}
return{type:"detailed",meta:{dept:f.department,meth:mL,cite:f.citation},title:f.topic,
abstract:`Bu ${mL.toLowerCase()} araştırma, ${f.department.toLowerCase()} alanında "${f.topic.toLowerCase()}" konusunu incelemektedir. Araştırmada ${tools.toLowerCase()} aracılığıyla veri toplanmış ve uygun analiz yöntemleriyle çözümlenmiştir. Bulgular, konunun bireysel, kurumsal ve toplumsal boyutlarıyla ele alınması gerektiğini ortaya koymaktadır.`,
kw:[f.topic.split(" ").slice(0,3).join(" "),mL,f.department,"Türkiye",f.citation],
secs:[
{t:"1. GİRİŞ",c:`${f.topic} konusu, ${f.department.toLowerCase()} alanında güncel ve önemli bir araştırma alanını oluşturmaktadır. İlgili literatür incelendiğinde, konuya olan akademik ilginin özellikle son beş yılda belirgin biçimde arttığı görülmektedir.\n\nBu çalışmanın amacı, "${f.topic.toLowerCase()}" konusunu ${mL.toLowerCase()} bir yaklaşımla derinlemesine incelemektir.\n\n${f.hypothesis?"Araştırmanın hipotezi: \""+f.hypothesis+"\"":"Araştırma soruları:\n1. "+f.topic+" konusundaki mevcut durum nedir?\n2. Bu konuyu etkileyen temel faktörler nelerdir?\n3. Konuyla ilgili ne tür müdahaleler önerilmektedir?"}`},
{t:"2. KAVRAMSAL ÇERÇEVE",c:`2.1. Temel Kavramlar\nKonuyla ilişkili kavramlar, ilgili alan yazın çerçevesinde tanımlanmış ve operasyonelleştirilmiştir.\n\n2.2. Kuramsal Altyapı\n${f.department} alanının temel kuramları çerçevesinde yapılandırılmıştır. Araştırmanın kuramsal temeli, konunun çok boyutlu doğasını yansıtacak şekilde oluşturulmuştur.\n\n2.3. İlgili Araştırmalar\nUlusal ve uluslararası düzeyde gerçekleştirilen önceki çalışmalar, konunun farklı boyutlarını ortaya koymaktadır. Mevcut literatürdeki boşluklar, bu araştırmanın gerekliliğini desteklemektedir.`},
{t:"3. YÖNTEM",c:mSec},
{t:"4. BULGULAR",c:fSec},
{t:"5. TARTIŞMA VE SONUÇ",c:`5.1. Tartışma\nBulgular, "${f.topic.toLowerCase()}" konusunun beklenen karmaşıklığını teyit etmektedir. Elde edilen sonuçlar önceki araştırmalarla büyük ölçüde tutarlıdır.\n\n${f.department} alanı açısından değerlendirildiğinde, bulguların hem kuramsal çerçeveyi desteklediği hem de pratiğe yönelik önemli çıkarımlar sunduğu görülmektedir.\n\n5.2. Öneriler\nAraştırmacılara:\n• Farklı araştırma desenleri ve örneklemlerle konunun incelenmesi\n• Boylamsal çalışmalarla nedensellik ilişkilerinin araştırılması\n\nPolitika yapıcılara:\n• Kanıta dayalı politika geliştirmede bulguların dikkate alınması\n\nUygulayıcılara:\n• Bulguların sahada uygulanabilir stratejilere dönüştürülmesi\n\n5.3. Sınırlılıklar\n${mL} çalışma olarak belirli sınırlılıklara sahiptir. Bulguların genellenebilirliği örneklem özellikleri çerçevesinde değerlendirilmelidir.`},
{t:"KAYNAKÇA",c:refs}
]};}


const C={bg:"#f0f5fb",card:"#ffffff",cb:"#d0dce8",ac:"#1e5a96",ac2:"#2b7cc9",acL:"#e8f1fa",gold:"#c9930e",goldL:"#fdf6e3",tx:"#1a2b3d",txD:"#5a7088",hero:"linear-gradient(135deg,#1e3a5f 0%,#2c5f8a 50%,#3b7dab 100%)"};
function Wm(){return(<div style={{position:"absolute",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:20,overflow:"hidden"}}>{Array.from({length:14}).map((_,i)=>(<div key={i} style={{position:"absolute",top:`${i*155-40}px`,left:"50%",transform:"translate(-50%,0) rotate(-35deg)",fontSize:"24px",fontWeight:700,color:"rgba(30,90,150,0.12)",whiteSpace:"nowrap",letterSpacing:"4px",userSelect:"none",width:"200%",textAlign:"center"}}>✍ Bu taslağı kendi yazım tarzınızla yeniden oluşturun • HayrAI ✍</div>))}</div>);}
function LoadingAnim(){return(<div style={{textAlign:"center",padding:"40px 20px"}}><div style={{display:"inline-block",position:"relative",width:60,height:60}}><div style={{position:"absolute",width:12,height:12,borderRadius:"50%",background:"#f97316",animation:"bounce 1.4s infinite",top:0,left:0}}></div><div style={{position:"absolute",width:12,height:12,borderRadius:"50%",background:"#2563eb",animation:"bounce 1.4s infinite",animationDelay:"0.2s",top:0,left:20}}></div><div style={{position:"absolute",width:12,height:12,borderRadius:"50%",background:"#16a34a",animation:"bounce 1.4s infinite",animationDelay:"0.4s",top:0,left:40}}></div></div><style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-20px)}`}</style><div style={{marginTop:16,fontSize:14,color:"#475569",fontWeight:500}}>✍️ AI modelleri makale yazıyor...</div><div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>Bu işlem 15-30 saniye sürebilir</div></div>);}
function Eth(){return(<div style={{background:C.hero,color:"#d4e4f5",padding:"8px 16px",textAlign:"center",fontSize:"11px"}}>⚖️ <strong>Etik:</strong> HayrAI etik akademik makale yazma uygulaması — sizin yerinize yazmaz, size ilham verir.</div>);}
function TopNav({go,title}){return(<div style={{background:C.card,padding:"12px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:`1px solid ${C.cb}`,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}><button onClick={()=>go("home")} style={{background:"none",border:"none",color:C.ac,fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:500}}>← Ana Sayfa</button><span style={{fontSize:18,fontWeight:300,flex:1}}><span style={{color:C.ac,fontWeight:700}}>HayrAI</span> <span style={{fontSize:12,color:C.txD}}>{title}</span></span></div>);}
function Btn({children,primary,gold,onClick,disabled,full,small}){return(<button onClick={onClick} disabled={disabled} style={{background:primary?"linear-gradient(135deg,#1e40af,#3b82f6)":gold?"linear-gradient(135deg,#f59e0b,#d97706)":"linear-gradient(135deg,#f8fafc,#e2e8f0)",color:primary||gold?"#fff":"#1e40af",border:"none",padding:small?"8px 16px":"12px 24px",fontSize:small?12:13,fontWeight:600,borderRadius:10,cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",width:full?"100%":"auto",opacity:disabled?.5:1,boxShadow:primary||gold?"0 2px 8px rgba(0,0,0,0.15)":"0 1px 3px rgba(0,0,0,0.08)",transition:"all .2s"}}>{children}</button>);}
function Card({children,glow,onClick,style:s}){return(<div onClick={onClick} style={{background:C.card,borderRadius:12,padding:"22px",border:`1px solid ${glow?C.ac+'30':C.cb}`,cursor:onClick?"pointer":"default",boxShadow:glow?"0 2px 16px rgba(30,90,150,0.06)":"0 1px 4px rgba(0,0,0,0.03)",...s}}>{children}</div>);}
/* Gumroad urun linklerini buraya yazin - Gumroad'da urun olusturduktan sonra */
const GUMROAD={monthly:"https://harryverse888.gumroad.com/l/fmjtva",single:"https://harryverse888.gumroad.com/l/yjfbgh",enabled:true};
function PayModal({plan,onDone,onCancel}){if(!plan)return null;const gumLink=plan.id==="monthly"?GUMROAD.monthly:plan.id==="single"?GUMROAD.single:null;return(<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(30,58,95,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,backdropFilter:"blur(6px)"}}><div style={{background:C.card,borderRadius:16,padding:"32px",maxWidth:400,width:"90%",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,0.15)"}}><div style={{fontSize:40,marginBottom:8}}>💳</div><h3 style={{margin:"0 0 4px",fontSize:17}}>{plan.name} — {plan.price}{plan.period}</h3><p style={{color:C.txD,fontSize:12,marginBottom:18}}>Gumroad güvenli ödeme altyapısı</p>
<div style={{background:C.bg,borderRadius:10,padding:"18px",marginBottom:14}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:12}}><span style={{fontSize:20}}>🔒</span><span style={{fontSize:12,color:C.txD}}>256-bit SSL ile korunan güvenli ödeme</span></div>
<div style={{display:"flex",flexDirection:"column",gap:6,textAlign:"left",fontSize:11,color:C.txD}}>
<div style={{display:"flex",gap:6}}>✓ Kredi kartı / Banka kartı</div>
<div style={{display:"flex",gap:6}}>✓ PayPal destekli</div>
<div style={{display:"flex",gap:6}}>✓ Global ödeme (150+ ülke)</div>
<div style={{display:"flex",gap:6}}>✓ Anında erişim</div>
</div></div>
{GUMROAD.enabled&&gumLink?<a href={gumLink} target="_blank" rel="noopener noreferrer" style={{display:"block",width:"100%",background:C.hero,color:"#fff",border:"none",padding:"14px",fontSize:15,fontWeight:700,borderRadius:8,cursor:"pointer",fontFamily:"inherit",textDecoration:"none",boxSizing:"border-box"}}>Gumroad ile Öde →</a>:<Btn primary full onClick={onDone}>Ödemeyi Tamamla</Btn>}
<button onClick={onCancel} style={{background:"none",border:"none",color:C.txD,fontSize:12,cursor:"pointer",marginTop:10}}>İptal</button>
<div style={{marginTop:12,display:"flex",justifyContent:"center",gap:12,alignItems:"center"}}><span style={{fontSize:9,color:C.txD}}>Powered by Gumroad</span></div>
</div></div>);}

export default function App(){
const[pg,setPg]=useState("home");const[art,setArt]=useState(null);const[ld,setLd]=useState(false);const[showPay,setShowPay]=useState(false);const[selPlan,setSelPlan]=useState(null);const[isPrem,setIsPrem]=useState(false);const[qt,setQt]=useState("");const[ql,setQl]=useState("temel");const[apiSt,setApiSt]=useState({temel:true,iyi:false,premium:false});const[apiWarn,setApiWarn]=useState(null);const[csvData,setCsvData]=useState(null);const[csvResult,setCsvResult]=useState(null);
useEffect(()=>{fetch('/api/check').then(r=>r.json()).then(d=>setApiSt(d)).catch(()=>{});},[]);
const[df,setDf]=useState({topic:"",department:"Eğitim Bilimleri",journal:"Belirtmek İstemiyorum",method:"quantitative",dataTools:["survey"],sampleDesc:"",citation:"APA 7",hypothesis:""});
const[anType,setAnType]=useState("test");const[anQ,setAnQ]=useState({depVar:"Sürekli (Ölçek/Oran)",groups:"2 bağımsız grup",normal:"Evet",sampleSize:"100",confidence:"95",effect:"medium",power:"80"});const[anR,setAnR]=useState(null);
const[exArt,setExArt]=useState(null);const[alts,setAlts]=useState(null);const[typing,setTyping]=useState(false);const[visChars,setVisChars]=useState(0);
// Typing animation effect
useEffect(()=>{if(!typing||!art)return;const total=art.secs?.reduce((a,s)=>a+(s.c||'').length,0)||0;if(visChars>=total){setTyping(false);return;}const t=setInterval(()=>setVisChars(p=>{if(p>=total){clearInterval(t);setTyping(false);return total;}return p+12;}),10);return()=>clearInterval(t);},[typing,art,visChars]);
const aRef=useRef(null);const go=setPg;const upd=(k,v)=>setDf(p=>({...p,[k]:v}));const togT=id=>setDf(p=>({...p,dataTools:p.dataTools.includes(id)?p.dataTools.filter(t=>t!==id):[...p.dataTools,id]}));
const callAPI=async(body)=>{try{const r=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const d=await r.json();if(d.noapi){setApiWarn(d.msg);setLd(false);return"noapi";}if(d.fallback)return null;if(d.alternatives)return{alternatives:d.alternatives};return d;}catch(e){/* ═══ ALTERNATIVES ═══ */
if(pg==="alts"&&alts)return(<div style={SS}><Eth/>
<TopNav go={go} title="📊 Alternatif Taslaklar"/>
<div style={{maxWidth:800,margin:"0 auto",padding:"20px"}}>
  <h2 style={{fontSize:20,fontWeight:300,fontFamily:"Georgia,serif",marginBottom:6}}>Farklı AI Modelleri ile Üretilen Taslaklar</h2>
  <p style={{color:C.txD,fontSize:12,marginBottom:6,lineHeight:1.6}}>Aşağıdaki taslakları karşılaştırın ve en uygun olanından ilham alarak <strong>kendi özgün çalışmanızı</strong> oluşturun.</p>
  <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
    <a href="https://www.springer.com/gp/editorial-policies/artificial-intelligence" target="_blank" rel="noopener" style={{fontSize:9,color:C.ac,textDecoration:"none",background:C.acL,padding:"3px 8px",borderRadius:10}}>📘 Springer AI Politikası</a>
    <a href="https://publicationethics.org/cope-position-statements/ai-author" target="_blank" rel="noopener" style={{fontSize:9,color:C.ac,textDecoration:"none",background:C.acL,padding:"3px 8px",borderRadius:10}}>📗 COPE AI Rehberi</a>
    <a href="https://www.tubitak.gov.tr" target="_blank" rel="noopener" style={{fontSize:9,color:C.ac,textDecoration:"none",background:C.acL,padding:"3px 8px",borderRadius:10}}>📕 TÜBİTAK</a>
    <a href="https://unesdoc.unesco.org/ark:/48223/pf0000381137" target="_blank" rel="noopener" style={{fontSize:9,color:C.ac,textDecoration:"none",background:C.acL,padding:"3px 8px",borderRadius:10}}>📙 UNESCO AI Etiği</a>
  </div>
  <div style={{display:"grid",gap:14}}>
    {alts.map((a,i)=>(
      <div key={i} style={{background:C.card,borderRadius:12,border:`1px solid ${C.cb}`,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
        <div style={{background:"linear-gradient(135deg,#0f172a,#1e3a5f)",padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <span style={{color:"#fbbf24",fontSize:13,fontWeight:700}}>Alternatif {i+1}</span>
            {a._p&&<span style={{color:"#94a3b8",fontSize:10,marginLeft:8}}>({a._p})</span>}
          </div>
          <button onClick={()=>{setArt(a);setVisChars(0);setTyping(true);go("result");}} style={{background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",border:"none",padding:"6px 16px",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Bu Taslağı Seç →</button>
        </div>
        <div style={{padding:"14px 16px"}}>
          <h3 style={{fontSize:14,fontWeight:600,color:C.tx,marginBottom:6,lineHeight:1.3}}>{a.title}</h3>
          <p style={{fontSize:11,color:C.txD,lineHeight:1.6,marginBottom:8}}>{a.abstract?.substring(0,250)}...</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:8}}>{(a.kw||[]).map((k,j)=><span key={j} style={{background:C.acL,color:C.ac,padding:"2px 6px",borderRadius:4,fontSize:9}}>{k}</span>)}</div>
          <div style={{fontSize:10,color:C.txD}}>
            <strong>Bölümler:</strong> {(a.secs||[]).map(s=>s.t).join(" → ")}
          </div>
        </div>
      </div>
    ))}
  </div>
  <div style={{marginTop:16,background:C.goldL,borderRadius:10,padding:"14px 16px",border:"1px solid #e8d5a0"}}>
    <p style={{fontSize:11,color:C.gold,margin:0,lineHeight:1.6}}>✍️ Bu taslaklar, araştırmanıza yön vermek ve yapı oluşturmak içindir. <strong>Lütfen seçtiğiniz taslağı kendi özgün yazım tarzınızla yeniden kaleme alın.</strong> AI destekli çalışmalarda <a href="https://publicationethics.org/cope-position-statements/ai-author" target="_blank" rel="noopener" style={{color:C.gold}}>COPE</a> ve <a href="https://www.springer.com/gp/editorial-policies/artificial-intelligence" target="_blank" rel="noopener" style={{color:C.gold}}>Springer</a> etik kurallarına uyun.</p>
  </div>
</div></div>);
/* ═══ ETHICS PAGE ═══ */
if(pg==="ethics")return(<div style={SS}><Eth/><TopNav go={go} title="📚 Etik AI Kullanım Rehberleri"/>
<div style={{maxWidth:700,margin:"0 auto",padding:"28px 20px"}}>
  <h2 style={{fontSize:22,fontWeight:300,fontFamily:"Georgia,serif",marginBottom:6}}>Akademik Yazımda Etik AI Kullanımı</h2>
  <p style={{color:C.txD,fontSize:13,marginBottom:20,lineHeight:1.7}}>Yapay zekâ destekli araçlar, akademik yazımda rehberlik amacıyla kullanılabilir. Ancak <strong>doğrudan kopya kullanımı etik ihlaldir.</strong> Aşağıdaki uluslararası rehberleri mutlaka inceleyin.</p>
  
  {[
    {title:"Springer — AI ve AI Destekli Teknolojiler Politikası",url:"https://www.springer.com/gp/editorial-policies/artificial-intelligence",desc:"Springer Nature, yazarların AI araçlarını şeffaf biçimde beyan etmesini zorunlu kılar. AI, yazar olarak listelenemez. Üretilen metnin sorumluluğu tamamen yazara aittir.",icon:"📘",color:"#2563eb"},
    {title:"COPE — Yapay Zekâ Araçları Hakkında Pozisyon Bildirisi",url:"https://publicationethics.org/cope-position-statements/ai-author",desc:"Committee on Publication Ethics (COPE), AI'nın yazarlık kriterlerini karşılamadığını belirtir. AI kullanımı methods bölümünde açıkça belirtilmelidir.",icon:"📗",color:"#16a34a"},
    {title:"UNESCO — Yapay Zekâ Etiği Tavsiye Kararı",url:"https://unesdoc.unesco.org/ark:/48223/pf0000381137",desc:"UNESCO'nun 193 üye devlet tarafından kabul edilen kapsamlı AI etiği çerçevesi. Şeffaflık, adalet, mahremiyet ve insan denetimi ilkelerini içerir.",icon:"📙",color:"#f59e0b"},
    {title:"TÜBİTAK — Araştırma ve Yayın Etiği",url:"https://www.tubitak.gov.tr/tr/destekler/akademik/arastirma-destek-programlari",desc:"TÜBİTAK'ın araştırma etiği ilkeleri ve Türkiye'deki akademik yayın standartları. Proje başvurularında etik beyan zorunluluğu.",icon:"📕",color:"#dc2626"},
    {title:"Elsevier — AI Kullanım Politikası",url:"https://www.elsevier.com/about/policies-and-standards/the-use-of-generative-ai-and-ai-assisted-technologies-in-writing-for-elsevier",desc:"Dünyanın en büyük akademik yayıncısı Elsevier, AI kullanımının beyan edilmesini ve yazarların tüm içerikten sorumlu olmasını zorunlu kılar.",icon:"📓",color:"#7c3aed"},
    {title:"Nature — AI Araçları Rehberi",url:"https://www.nature.com/nature-portfolio/editorial-policies/ai",desc:"Nature dergisi grubu, AI destekli metin ve görsellerin kullanımında tam şeffaflık bekler. AI yazar olarak kabul edilmez.",icon:"📔",color:"#0891b2"},
    {title:"Horizon Europe — AI Kullanım Beyanı",url:"https://www.emdesk.com/horizon-2020-horizon-europe-basics-guide/horizon-europe-using-ai-in-grant-proposal-writing-responsibly",desc:"AB Horizon Europe programında 2025'ten itibaren AI kullanım beyanı zorunludur. Kullanılan araçlar, kaynaklar ve sınırlılıklar belirtilmelidir.",icon:"🇪🇺",color:"#1e40af"}
  ].map((r,i)=>(
    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{display:"block",background:C.card,borderRadius:12,padding:"16px",marginBottom:10,border:"1px solid "+C.cb,textDecoration:"none",borderLeft:"4px solid "+r.color,boxShadow:"0 1px 4px rgba(0,0,0,0.04)",transition:"all .2s"}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
        <span style={{fontSize:24}}>{r.icon}</span>
        <div>
          <h3 style={{fontSize:14,fontWeight:600,color:r.color,margin:"0 0 4px"}}>{r.title}</h3>
          <p style={{fontSize:11,color:C.txD,margin:0,lineHeight:1.6}}>{r.desc}</p>
          <span style={{fontSize:10,color:r.color,marginTop:4,display:"inline-block"}}>Rehberi İncele →</span>
        </div>
      </div>
    </a>
  ))}
  
  <div style={{background:"linear-gradient(135deg,#0f172a,#1e3a5f)",borderRadius:12,padding:"20px",marginTop:16,color:"#fff",textAlign:"center"}}>
    <h3 style={{fontSize:16,fontWeight:300,fontFamily:"Georgia,serif",marginBottom:8}}>HayrAI Etik Taahhüdü</h3>
    <p style={{fontSize:12,color:"#cbd5e1",lineHeight:1.7,maxWidth:500,margin:"0 auto"}}>HayrAI, araştırmacı yerine makale yazmaz — <strong style={{color:"#fbbf24"}}>ilham verir, yapı önerir, rehberlik eder.</strong> Tüm çıktılar filigranla korunur ve "kendi yazım tarzınızla yeniden oluşturun" uyarısı ile sunulur. Platform, COPE ve UNESCO ilkeleriyle tam uyumludur.</p>
  </div>
</div></div>);
return null;}};
const doAnalyze=async()=>{if(!csvData)return;setLd(true);try{const r=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data:csvData,quality:ql})});const d=await r.json();if(d.noapi){setApiWarn(d.msg);setLd(false);return;}setCsvResult(d);setLd(false);}catch(e){setApiWarn("Bağlantı hatası");setLd(false);}};
const transferToArticle=()=>{if(!csvResult)return;const rpt=csvResult.reportText||csvResult.descriptive||"";setDf(p=>({...p,topic:p.topic||(csvResult.summary||"Veri Analizi"),sampleDesc:"N="+csvResult.n}));setQt(csvResult.summary||"");go("detailed");};
const doQ=async()=>{if(!qt.trim())return;setLd(true);setAlts(null);if(ql!=="temel"){const d=await callAPI({mode:"quick",topic:qt,quality:ql,analysisData:csvResult?.reportText||""});if(d==="noapi")return;if(d&&d.alternatives){setAlts(d.alternatives.map(a=>({type:"quick",title:a.title,abstract:a.abstract,kw:a.keywords||[],secs:(a.sections||[]).map(s=>({t:s.title,c:s.content})),_p:a._provider})));setLd(false);go("alts");return;}if(d&&d.title){setArt({type:"quick",title:d.title,abstract:d.abstract,kw:d.keywords||[],secs:(d.sections||[]).map(s=>({t:s.title,c:s.content}))});setLd(false);setVisChars(0);setTyping(true);go("result");return;}}setArt(genQuick(qt));setLd(false);setVisChars(0);setTyping(true);go("result");};
const doD=async()=>{if(!df.topic.trim())return;setLd(true);setAlts(null);if(ql!=="temel"){const d=await callAPI({mode:"detailed",...df,quality:ql,analysisData:csvResult?.reportText||""});if(d==="noapi")return;if(d&&d.alternatives){setAlts(d.alternatives.map(a=>({type:"detailed",meta:{dept:df.department,meth:METHS.find(m=>m.id===df.method)?.label,cite:df.citation},title:a.title,abstract:a.abstract,kw:a.keywords||[],secs:(a.sections||[]).map(s=>({t:s.title,c:s.content})),_p:a._provider})));setLd(false);go("alts");return;}if(d&&d.title){setArt({type:"detailed",meta:{dept:df.department,meth:METHS.find(m=>m.id===df.method)?.label,cite:df.citation},title:d.title,abstract:d.abstract,kw:d.keywords||[],secs:(d.sections||[]).map(s=>({t:s.title,c:s.content}))});setVisChars(0);setTyping(true);setLd(false);go("result");return;}}setArt(genDetailed(df));setLd(false);setVisChars(0);setTyping(true);go("result");};
const doA=()=>{setLd(true);setTimeout(()=>{if(anType==="test")setAnR({type:"test",tests:getTests(anQ)});else if(anType==="sample")setAnR({type:"sample",...calcSample(anQ)});else setAnR(null);setLd(false);},1200);};
const doPrint=(a)=>{const ref=a||art;if(!ref)return;const c=aRef.current?.innerHTML;const w=window.open("","_blank");w.document.write(`<html><head><title>${ref.title}</title><style>body{font-family:Georgia,serif;max-width:640px;margin:32px auto;padding:20px;color:#1a2b3d;line-height:1.8;font-size:13px}h1{font-size:17px;text-align:center}h2{font-size:13px;border-bottom:1px solid #d0dce8;padding-bottom:4px}.wm{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-35deg);font-size:50px;color:rgba(30,90,150,0.06);white-space:nowrap;pointer-events:none;z-index:999}.eth{background:#e8f1fa;padding:10px;border:1px solid #d0dce8;font-size:11px;color:#1e5a96;margin-bottom:14px;text-align:center;border-radius:6px}</style></head><body><div class="wm">⚠ KENDİNİZ YAZIN ⚠</div><div class="eth">⚖️ HayrAI taslağıdır.</div>${c}</body></html>`);w.document.close();w.print();};
const SS={fontFamily:"'Plus Jakarta Sans',sans-serif",background:C.bg,minHeight:"100vh",color:C.tx};

const getVisibleText=(text,secs)=>{if(!typing)return text;let count=0;for(let i=0;i<secs.length;i++){const len=(secs[i].c||'').length;if(count+len<=visChars){count+=len;}else{if(i===secs.findIndex(s=>s.c===text)){const remaining=visChars-count;return text.substring(0,remaining)+(remaining<text.length?"▌":"");}count+=len;}}return text;};
const lbl={fontSize:11,fontWeight:600,color:C.ac,display:"block",marginBottom:4};
const inp={width:"100%",padding:"10px 12px",fontSize:13,border:`1px solid ${C.cb}`,borderRadius:8,fontFamily:"inherit",background:C.card,boxSizing:"border-box",outline:"none"};

/* ═══ HOME ═══ */
if(pg==="home")return(<div style={SS}><Eth/>
<div style={{background:C.hero,position:"relative",overflow:"hidden"}}><div style={{display:"flex",flexWrap:"wrap",alignItems:"center",maxWidth:1100,margin:"0 auto"}}><div style={{flex:"1 1 380px",padding:"44px 24px",position:"relative",zIndex:1}}><div style={{fontSize:11,letterSpacing:5,color:"#9ec5e8",marginBottom:10,textTransform:"uppercase",fontWeight:600}}>Yapay Zekâ Destekli</div><h1 style={{fontSize:"clamp(30px,5vw,46px)",fontWeight:300,color:"#fff",margin:"0 0 6px",lineHeight:1.1,fontFamily:"'DM Serif Display',serif"}}>Hayr<span style={{fontWeight:700,color:"#ffd76e"}}>AI</span></h1><p style={{fontSize:14,color:"#b8d4ec",margin:"0 0 14px",fontStyle:"italic",fontFamily:"'DM Serif Display',serif"}}>Etik Akademik Makale Yazma Uygulaması</p><p style={{fontSize:13,color:"#c5ddf0",maxWidth:400,margin:"0 0 22px",lineHeight:1.7}}>Profesörlerden araştırma görevlilerine — <strong style={{color:"#ffd76e"}}>sizin yerinize yazmadan</strong>.</p>
<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
<button onClick={()=>go("quick")} style={{background:"linear-gradient(135deg,#f97316,#ea580c)",color:"#fff",border:"none",padding:"10px 16px",fontSize:12,fontWeight:600,borderRadius:8,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 2px 8px rgba(249,115,22,0.3)"}}>⚡ Hızlı Taslak Makale Yaz</button>
<button onClick={()=>go("detailed")} style={{background:"linear-gradient(135deg,#f97316,#ea580c)",color:"#fff",border:"none",padding:"10px 16px",fontSize:12,fontWeight:600,borderRadius:8,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 2px 8px rgba(249,115,22,0.3)"}}>🔬 Ayrıntılı Makale Yaz</button>
<button onClick={()=>go("analysis")} style={{background:"linear-gradient(135deg,#f97316,#ea580c)",color:"#fff",border:"none",padding:"10px 16px",fontSize:12,fontWeight:600,borderRadius:8,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 2px 8px rgba(249,115,22,0.3)"}}>📊 Verileri Analiz Et</button>
<button onClick={()=>go("examples")} style={{background:"linear-gradient(135deg,#f97316,#ea580c)",color:"#fff",border:"none",padding:"10px 16px",fontSize:12,fontWeight:600,borderRadius:8,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 2px 8px rgba(249,115,22,0.3)"}}>📄 Örnek Makaleler</button>
<button onClick={()=>go("ethics")} style={{background:"rgba(255,255,255,0.12)",color:"#fbbf24",border:"1px solid rgba(251,191,36,0.3)",padding:"10px 16px",fontSize:12,fontWeight:600,borderRadius:8,cursor:"pointer",fontFamily:"inherit"}}>📚 Etik AI Kullanım Rehberleri</button>
</div>
<div style={{display:"flex",alignItems:"center",gap:8,marginTop:20}}><div style={{display:"flex"}}>{[IMG.av3,IMG.av1,IMG.av4,IMG.av2,IMG.av5,IMG.av6].map((a,i)=><img key={i} src={a} style={{width:30,height:30,borderRadius:"50%",objectFit:"cover",border:"2px solid #1e3a5f",marginLeft:i>0?-8:0,position:"relative",zIndex:6-i}} alt=""/>)}</div><div style={{fontSize:11,color:"#9ec5e8"}}><strong style={{color:"#ffd76e"}}>2.400+</strong> akademisyen</div></div>
</div><div style={{flex:"1 1 320px",position:"relative",minHeight:280}}><img src={IMG.hero} alt="" style={{width:"100%",height:"100%",objectFit:"cover",minHeight:280,display:"block",opacity:0.9}}/><div style={{position:"absolute",top:0,left:0,width:"40%",height:"100%",background:"linear-gradient(90deg,#1e3a5f,transparent)"}}/></div></div></div>

{/* PROBLEM */}
<div style={{maxWidth:900,margin:"0 auto",padding:"44px 20px"}}><div style={{display:"flex",flexWrap:"wrap",gap:24,alignItems:"center"}}><div style={{flex:"1 1 300px"}}><div style={{fontSize:11,letterSpacing:3,color:C.ac2,textTransform:"uppercase",fontWeight:600,marginBottom:8}}>Neden HayrAI?</div><h2 style={{fontSize:22,fontWeight:300,marginBottom:12,fontFamily:"'DM Serif Display',serif"}}>Türkiye'nin Akademik Yayın İhtiyacı</h2><p style={{fontSize:13,color:C.txD,lineHeight:1.8,marginBottom:12}}>Türkiye dünyada <strong style={{color:C.ac}}>17. sırada</strong>. Genç akademisyenler ilk yayınlarında güçlük çekiyor.</p><div style={{display:"flex",gap:16}}><div style={{textAlign:"center"}}><div style={{fontSize:24,fontWeight:700,color:C.ac,fontFamily:"'DM Serif Display',serif"}}>200K+</div><div style={{fontSize:10,color:C.txD}}>Akademisyen</div></div><div style={{textAlign:"center"}}><div style={{fontSize:24,fontWeight:700,color:C.ac,fontFamily:"'DM Serif Display',serif"}}>600K+</div><div style={{fontSize:10,color:C.txD}}>Lisansüstü</div></div><div style={{textAlign:"center"}}><div style={{fontSize:24,fontWeight:700,color:"#c44",fontFamily:"'DM Serif Display',serif"}}>17.</div><div style={{fontSize:10,color:C.txD}}>Dünya</div></div></div></div><div style={{flex:"1 1 280px"}}><img src={IMG.problem} alt="" style={{width:"100%",borderRadius:12,boxShadow:"0 4px 20px rgba(0,0,0,0.1)"}}/></div></div></div>

{/* MODES */}
<div style={{background:C.card,borderTop:`1px solid ${C.cb}`,borderBottom:`1px solid ${C.cb}`,padding:"40px 20px"}}><div style={{maxWidth:900,margin:"0 auto"}}><h2 style={{textAlign:"center",fontSize:22,fontWeight:300,marginBottom:28,fontFamily:"'DM Serif Display',serif"}}>Platform Özellikleri</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:14}}>
<Card glow onClick={()=>go("quick")} style={{borderTop:"3px solid #f97316"}}><span style={{fontSize:24}}>⚡</span><h3 style={{fontSize:14,fontWeight:600,margin:"6px 0 3px",color:"#f97316"}}>Hızlı Taslak Makale Yaz</h3><p style={{fontSize:11,color:C.txD,margin:0}}>Konu gir, anında akademik taslak al.</p></Card>
<Card glow onClick={()=>go("detailed")} style={{borderTop:"3px solid #f97316"}}><span style={{fontSize:24}}>🔬</span><h3 style={{fontSize:14,fontWeight:600,margin:"6px 0 3px",color:"#f97316"}}>Ayrıntılı Makale Yaz</h3><p style={{fontSize:11,color:C.txD,margin:0}}>Yöntem, dergi, örneklem belirle.</p></Card>
<Card glow onClick={()=>go("analysis")} style={{borderTop:"3px solid #f97316"}}><span style={{fontSize:24}}>📊</span><h3 style={{fontSize:14,fontWeight:600,margin:"6px 0 3px",color:"#f97316"}}>Verileri Analiz Et</h3><p style={{fontSize:11,color:C.txD,margin:0}}>CSV yükle, test seç, yorumla.</p></Card>
<Card glow onClick={()=>go("examples")} style={{borderTop:"3px solid #f97316"}}><span style={{fontSize:24}}>📄</span><h3 style={{fontSize:14,fontWeight:600,margin:"6px 0 3px",color:"#f97316"}}>HayrAI Örnek Makaleler</h3><p style={{fontSize:11,color:C.txD,margin:0}}>AI tarafından yazılmış örnekler.</p></Card>
<Card glow onClick={()=>go("ethics")} style={{borderTop:"3px solid #1e40af"}}><span style={{fontSize:24}}>📚</span><h3 style={{fontSize:14,fontWeight:600,margin:"6px 0 3px",color:"#1e40af"}}>Etik AI Kullanım Rehberleri</h3><p style={{fontSize:11,color:C.txD,margin:0}}>Springer, COPE, UNESCO, TÜBİTAK.</p></Card>
</div></div></div>

{/* TESTIMONIALS */}
<div style={{maxWidth:900,margin:"0 auto",padding:"40px 20px"}}><h2 style={{textAlign:"center",fontSize:22,fontWeight:300,marginBottom:24,fontFamily:"'DM Serif Display',serif"}}>Akademisyenler Ne Diyor?</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>{TESTIMONIALS.map((t,i)=><Card key={i}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><img src={t.avatar} alt="" style={{width:40,height:40,borderRadius:"50%",objectFit:"cover",border:t.senior?`2px solid ${C.gold}`:`2px solid ${C.acL}`}}/><div><div style={{fontSize:12,fontWeight:600}}>{t.name}</div><div style={{fontSize:10,color:C.txD}}>{t.role}</div>{t.senior&&<span style={{fontSize:8,background:C.goldL,color:C.gold,padding:"1px 4px",borderRadius:4,fontWeight:600}}>Kıdemli</span>}</div></div><p style={{fontSize:11,color:C.txD,margin:0,lineHeight:1.6,fontStyle:"italic"}}>"{t.text}"</p><div style={{marginTop:6,color:C.gold,fontSize:11}}>★★★★★</div></Card>)}</div></div>

{/* CORP CTA */}
<div style={{position:"relative",overflow:"hidden"}}><img src={IMG.profGroup} alt="" style={{width:"100%",height:180,objectFit:"cover"}}/><div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"linear-gradient(135deg,rgba(30,58,95,0.88),rgba(43,124,201,0.75))",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8}}><h3 style={{color:"#fff",fontSize:20,fontWeight:300,fontFamily:"'DM Serif Display',serif",margin:0}}>Üniversiteniz İçin Kurumsal Plan</h3><Btn gold onClick={()=>go("pricing")}>Planları İncele →</Btn></div></div>

<div style={{background:C.card,padding:"28px 20px",textAlign:"center",display:"flex",justifyContent:"center",gap:44,flexWrap:"wrap",borderTop:`1px solid ${C.cb}`}}>{[{n:"2.400+",l:"Araştırmacı"},{n:"8.700+",l:"Taslak"},{n:"156",l:"Üniversite"},{n:"4.8/5",l:"Puan"}].map((s,i)=><div key={i}><div style={{fontSize:22,fontWeight:700,color:C.ac,fontFamily:"'DM Serif Display',serif"}}>{s.n}</div><div style={{fontSize:10,color:C.txD,letterSpacing:2,textTransform:"uppercase"}}>{s.l}</div></div>)}</div>
<div style={{padding:"18px",textAlign:"center",fontSize:10,color:C.txD}}>© 2026 HayrAI — hayrai.com</div>
</div>);

/* ═══ EXAMPLES ═══ */
if(pg==="examples"&&!exArt)return(<div style={SS}><Eth/><TopNav go={go} title="📄 Örnek Makaleler"/>
<div style={{maxWidth:800,margin:"0 auto",padding:"32px 20px"}}>
  <h2 style={{fontSize:22,fontWeight:300,fontFamily:"'DM Serif Display',serif",marginBottom:6}}>Örnek Makale Taslakları</h2>
  <p style={{color:C.txD,fontSize:13,marginBottom:24,lineHeight:1.7}}>HayrAI'nin ürettiği örnek taslakları inceleyin. Tüm örnekler <strong style={{color:C.ac}}>filigranlıdır</strong> — doğrudan kullanılamaz, araştırmanıza yapı ve ilham vermek içindir.</p>
  <div style={{display:"flex",flexDirection:"column",gap:16}}>
    {EXAMPLE_ARTICLES.map(ex=>(
      <Card key={ex.id} glow onClick={()=>{setExArt(ex);}} style={{cursor:"pointer"}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
              <span style={{background:ex.badgeColor,color:"#fff",padding:"3px 10px",borderRadius:6,fontSize:10,fontWeight:600}}>{ex.badge}</span>
              {ex.meta.dept&&<span style={{background:C.acL,color:C.ac,padding:"3px 8px",borderRadius:6,fontSize:10}}>{ex.meta.dept}</span>}
              <span style={{background:C.goldL,color:C.gold,padding:"3px 8px",borderRadius:6,fontSize:10}}>Filigranlı</span>
            </div>
            <h3 style={{fontSize:15,fontWeight:600,marginBottom:8,lineHeight:1.4}}>{ex.title}</h3>
            <p style={{fontSize:12,color:C.txD,lineHeight:1.6,margin:"0 0 8px"}}>{ex.abstract.substring(0,180)}...</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{ex.kw.map((k,i)=><span key={i} style={{background:C.bg,padding:"2px 6px",borderRadius:4,fontSize:9,color:C.ac}}>{k}</span>)}</div>
            <div style={{marginTop:10,fontSize:12,color:C.ac2,fontWeight:600}}>Makaleyi İncele →</div>
          </div>
        </div>
      </Card>
    ))}
  </div>
  <Card style={{marginTop:20,background:C.goldL,border:`1px solid #e8d5a0`,textAlign:"center"}}>
    <p style={{fontSize:12,color:C.gold,margin:"0 0 10px"}}>⚖️ Bu taslaklar doğrudan akademik çalışma olarak kullanılamaz. Kendi özgün çalışmanızı yazmak için rehber niteliğindedir.</p>
    <Btn primary small onClick={()=>go("quick")}>Kendi Taslağınızı Oluşturun →</Btn>
  </Card>
</div></div>);

/* ═══ EXAMPLE DETAIL ═══ */
if(pg==="examples"&&exArt)return(<div style={SS}><Eth/>
<div style={{background:C.card,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,borderBottom:`1px solid ${C.cb}`}}>
  <div style={{display:"flex",alignItems:"center",gap:12}}><button onClick={()=>setExArt(null)} style={{background:"none",border:"none",color:C.ac,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>← Örnekler</button><span style={{fontSize:17,fontFamily:"'DM Serif Display',serif"}}><span style={{color:C.ac,fontWeight:700}}>HayrAI</span> <span style={{fontSize:12,color:C.txD}}>Örnek Makale</span></span></div>
  <div style={{display:"flex",gap:6}}><span style={{background:exArt.badgeColor,color:"#fff",padding:"4px 10px",borderRadius:6,fontSize:10,fontWeight:600}}>{exArt.badge}</span></div>
</div>
<div style={{maxWidth:720,margin:"0 auto",padding:"16px 20px"}}>
  <Card style={{background:C.goldL,border:`1px solid #e8d5a0`,marginBottom:14,padding:"10px 14px"}}><p style={{fontSize:11,color:C.gold,margin:0}}>✍️ Bu örnek taslak, size yapı ve ilham vermek içindir. <strong>Kendi yazım tarzınızla özgün çalışmanızı oluşturun.</strong></p></Card>
  <div ref={aRef} style={{background:C.card,borderRadius:8,padding:"32px 28px",position:"relative",lineHeight:1.8,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",border:`1px solid ${C.cb}`,userSelect:"none",WebkitUserSelect:"none"}}><Wm/><div style={{position:"relative",zIndex:1,opacity:0.75}}>
    <h1 style={{fontSize:16,textAlign:"center",fontWeight:700,marginBottom:16,fontFamily:"'DM Serif Display',serif",lineHeight:1.4}}>{exArt.title}</h1>
    <div style={{background:C.bg,padding:"12px 16px",borderRadius:6,marginBottom:16,borderLeft:`3px solid ${C.ac}`}}><strong style={{fontSize:11}}>ÖZET</strong><p style={{fontSize:12,margin:"4px 0 0",color:C.txD}}>{exArt.abstract}</p></div>
    <div style={{marginBottom:16}}><strong style={{fontSize:10,color:C.txD}}>Anahtar Kelimeler: </strong>{exArt.kw.map((k,i)=><span key={i} style={{display:"inline-block",background:C.acL,padding:"2px 6px",borderRadius:4,fontSize:10,color:C.ac,margin:"2px 3px 2px 0"}}>{k}</span>)}</div>
    <hr style={{border:"none",borderTop:`1px solid ${C.cb}`,margin:"16px 0"}}/>
    {exArt.secs.map((s,i)=><div key={i} style={{marginBottom:20}}><h2 style={{fontSize:13,fontWeight:700,borderBottom:`1px solid ${C.cb}`,paddingBottom:4,marginBottom:8,color:C.ac}}>{s.t}</h2><div style={{fontSize:12,color:"#333",whiteSpace:"pre-line",textAlign:"justify"}}>{typing?getVisibleText(s.c,art.secs):s.c}</div></div>)}
  </div></div>
  <Card style={{marginTop:16,background:C.acL,textAlign:"center"}}><h3 style={{color:C.ac,fontSize:14,fontWeight:400,margin:"0 0 10px",fontFamily:"'DM Serif Display',serif"}}>Kendi makalenizi oluşturmak ister misiniz?</h3><div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}><Btn gold onClick={()=>go("quick")}>⚡ Hızlı Taslak</Btn><Btn primary onClick={()=>go("detailed")}>🔬 Ayrıntılı Makale</Btn><Btn onClick={()=>go("pricing")}>💎 Planlar</Btn></div></Card>
</div></div>);

/* ═══ QUICK ═══ */
if(pg==="quick")return(<div style={SS}><Eth/><TopNav go={go} title="⚡ Hızlı Taslak"/><div style={{maxWidth:620,margin:"0 auto",padding:"32px 20px"}}><h2 style={{fontSize:20,fontWeight:300,fontFamily:"'DM Serif Display',serif",marginBottom:6}}>Konunuzu Girin</h2><textarea value={qt} onChange={e=>setQt(e.target.value)} placeholder="Örn: Sosyal medya kullanımının akademik başarıya etkisi..." style={{...inp,minHeight:70,resize:"vertical"}}/><div style={{marginTop:6,marginBottom:16}}>{SMPL.map((t,i)=><button key={i} onClick={()=>setQt(t)} style={{background:C.acL,border:"none",padding:"3px 8px",borderRadius:6,fontSize:10,color:C.ac,cursor:"pointer",margin:3,fontFamily:"inherit"}}>{t.substring(0,30)}...</button>)}</div>{ld&&<LoadingAnim/>}
<Btn gold full onClick={doQ} disabled={!qt.trim()||ld}>{ld?"⏳ Hazırlanıyor...":"⚡ Hızlı Taslak Oluştur"}</Btn><div style={{marginTop:10}}><div style={{fontSize:9,fontWeight:600,color:C.ac,marginBottom:4}}>Kalite Seviyesi:</div><div style={{display:"flex",gap:4}}>{[{id:"temel",l:"Temel",d:"Hazır şablon",i:"📝",ok:true},{id:"iyi",l:"İyi",d:apiSt.iyi?"AI aktif ✓":"API gerekli",i:"🤖",ok:apiSt.iyi},{id:"premium",l:"Premium",d:apiSt.premium?"Aktif ✓":"Abone olun",i:"👑",ok:apiSt.premium}].map(q=><button key={q.id} onClick={()=>setQl(q.id)} style={{flex:1,background:ql===q.id?q.id==="premium"?"linear-gradient(135deg,#f59e0b,#d97706)":q.id==="iyi"?"#16a34a":C.ac:q.ok?"#fff":"#fef2f2",color:ql===q.id?"#fff":C.txD,border:`1.5px solid ${ql===q.id?"transparent":C.cb}`,borderRadius:6,padding:"6px 4px",fontSize:8,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}><div style={{fontSize:14}}>{q.i}</div><div style={{fontWeight:700,marginTop:1}}>{q.l} {q.ok?<span style={{display:"inline-block",width:5,height:5,borderRadius:"50%",background:"#16a34a"}}/>:<span style={{display:"inline-block",width:5,height:5,borderRadius:"50%",background:"#dc2626"}}/>}</div><div style={{fontSize:7,opacity:0.8,marginTop:1}}>{q.d}</div></button>)}</div></div></div></div>);

/* ═══ DETAILED ═══ */
if(pg==="detailed")return(<div style={SS}><Eth/><TopNav go={go} title="🔬 Ayrıntılı Makale"/><div style={{maxWidth:660,margin:"0 auto",padding:"28px 20px"}}><h2 style={{fontSize:20,fontWeight:300,fontFamily:"'DM Serif Display',serif",marginBottom:16}}>Makale Detayları</h2><div style={{display:"flex",flexDirection:"column",gap:14}}><div><label style={lbl}>📝 Konu *</label><textarea value={df.topic} onChange={e=>upd("topic",e.target.value)} placeholder="Araştırma konusu..." style={{...inp,minHeight:60,resize:"vertical"}}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><div><label style={lbl}>🏫 Bölüm</label><select value={df.department} onChange={e=>upd("department",e.target.value)} style={{...inp,appearance:"auto"}}>{DEPTS.map(d=><option key={d}>{d}</option>)}</select></div><div><label style={lbl}>📰 Dergi</label><select value={df.journal} onChange={e=>upd("journal",e.target.value)} style={{...inp,appearance:"auto"}}>{JRNLS.map(j=><option key={j}>{j}</option>)}</select></div></div><div><label style={lbl}>🔬 Yöntem</label><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:6}}>{METHS.map(m=><button key={m.id} onClick={()=>upd("method",m.id)} style={{background:df.method===m.id?C.acL:C.card,color:df.method===m.id?C.ac:C.txD,border:`1.5px solid ${df.method===m.id?C.ac:C.cb}`,padding:"9px 4px",borderRadius:8,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:df.method===m.id?600:400,textAlign:"center"}}>{m.icon} {m.label}</button>)}</div></div><div><label style={lbl}>📋 Veri Toplama</label><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{DTOOLS.map(t=><button key={t.id} onClick={()=>togT(t.id)} style={{background:df.dataTools.includes(t.id)?C.acL:C.card,color:df.dataTools.includes(t.id)?C.ac:C.txD,border:`1px solid ${df.dataTools.includes(t.id)?C.ac:C.cb}`,padding:"5px 10px",borderRadius:20,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>{df.dataTools.includes(t.id)?"✓ ":""}{t.label}</button>)}</div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><div><label style={lbl}>👥 Örneklem</label><input value={df.sampleDesc} onChange={e=>upd("sampleDesc",e.target.value)} placeholder="400 öğrenci" style={inp}/></div><div><label style={lbl}>📎 Atıf</label><select value={df.citation} onChange={e=>upd("citation",e.target.value)} style={{...inp,appearance:"auto"}}>{CITES.map(c=><option key={c}>{c}</option>)}</select></div></div><div><label style={lbl}>💡 Hipotez</label><input value={df.hypothesis} onChange={e=>upd("hypothesis",e.target.value)} placeholder="X ile Y arasında anlamlı ilişki vardır." style={inp}/></div></div><div style={{marginTop:20}}><div style={{marginBottom:10}}><div style={{fontSize:9,fontWeight:600,color:C.ac,marginBottom:4}}>Kalite Seviyesi:</div><div style={{display:"flex",gap:4}}>{[{id:"temel",l:"Temel",d:"Hazır şablon",i:"📝",ok:true},{id:"iyi",l:"İyi",d:apiSt.iyi?"AI aktif ✓":"API gerekli",i:"🤖",ok:apiSt.iyi},{id:"premium",l:"Premium",d:apiSt.premium?"Aktif ✓":"Abone olun",i:"👑",ok:apiSt.premium}].map(q=><button key={q.id} onClick={()=>setQl(q.id)} style={{flex:1,background:ql===q.id?q.id==="premium"?"linear-gradient(135deg,#f59e0b,#d97706)":q.id==="iyi"?"#16a34a":C.ac:q.ok?"#fff":"#fef2f2",color:ql===q.id?"#fff":C.txD,border:`1.5px solid ${ql===q.id?"transparent":C.cb}`,borderRadius:6,padding:"6px 4px",fontSize:8,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}><div style={{fontSize:14}}>{q.i}</div><div style={{fontWeight:700,marginTop:1}}>{q.l} {q.ok?<span style={{display:"inline-block",width:5,height:5,borderRadius:"50%",background:"#16a34a"}}/>:<span style={{display:"inline-block",width:5,height:5,borderRadius:"50%",background:"#dc2626"}}/>}</div><div style={{fontSize:7,opacity:0.8,marginTop:1}}>{q.d}</div></button>)}</div></div>{ld&&<LoadingAnim/>}
<Btn primary full onClick={doD} disabled={!df.topic.trim()||ld}>{ld?"✍️ AI makale yazıyor...":"🔬 Ayrıntılı Makale Yaz"}</Btn></div></div></div>);

/* ═══ ANALYSIS ═══ */
if(pg==="analysis")return(<div style={SS}><Eth/><TopNav go={go} title="📊 Analiz"/><div style={{maxWidth:680,margin:"0 auto",padding:"28px 20px"}}><h2 style={{fontSize:20,fontWeight:300,fontFamily:"'DM Serif Display',serif",marginBottom:20}}>Analiz Rehberi</h2>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8,marginBottom:22}}>{AN_TYPES.map(a=><button key={a.id} onClick={()=>{setAnType(a.id);setAnR(null);}} style={{background:anType===a.id?C.acL:C.card,border:`1.5px solid ${anType===a.id?C.ac2:C.cb}`,borderRadius:10,padding:"12px 8px",cursor:"pointer",textAlign:"center",fontFamily:"inherit"}}><div style={{fontSize:20}}>{a.icon}</div><div style={{fontSize:11,fontWeight:600,color:anType===a.id?C.ac2:C.tx,marginTop:2}}>{a.label}</div></button>)}</div>
{anType==="test"&&<Card><h3 style={{fontSize:14,color:C.ac,margin:"0 0 14px",fontWeight:600}}>🧪 Test Seçici</h3><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><div><label style={lbl}>Bağımlı Değişken</label><select value={anQ.depVar} onChange={e=>setAnQ(p=>({...p,depVar:e.target.value}))} style={{...inp,appearance:"auto"}}>{VAR_T.map(v=><option key={v}>{v}</option>)}</select></div><div><label style={lbl}>Grup</label><select value={anQ.groups} onChange={e=>setAnQ(p=>({...p,groups:e.target.value}))} style={{...inp,appearance:"auto"}}>{GRP_O.map(g=><option key={g}>{g}</option>)}</select></div><div><label style={lbl}>Normal?</label><select value={anQ.normal} onChange={e=>setAnQ(p=>({...p,normal:e.target.value}))} style={{...inp,appearance:"auto"}}><option>Evet</option><option>Hayır</option></select></div><div><label style={lbl}>N</label><input value={anQ.sampleSize} onChange={e=>setAnQ(p=>({...p,sampleSize:e.target.value}))} style={inp}/></div></div><div style={{marginTop:14}}><Btn primary full onClick={doA} disabled={ld}>{ld?"⏳...":"🧪 Test Öner"}</Btn></div></Card>}
{anType==="sample"&&<Card><h3 style={{fontSize:14,color:C.ac,margin:"0 0 14px",fontWeight:600}}>📐 Örneklem</h3><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}><div><label style={lbl}>Güven</label><select value={anQ.confidence} onChange={e=>setAnQ(p=>({...p,confidence:e.target.value}))} style={{...inp,appearance:"auto"}}><option value="90">%90</option><option value="95">%95</option><option value="99">%99</option></select></div><div><label style={lbl}>Etki</label><select value={anQ.effect} onChange={e=>setAnQ(p=>({...p,effect:e.target.value}))} style={{...inp,appearance:"auto"}}><option value="small">Küçük</option><option value="medium">Orta</option><option value="large">Büyük</option></select></div><div><label style={lbl}>Güç</label><select value={anQ.power} onChange={e=>setAnQ(p=>({...p,power:e.target.value}))} style={{...inp,appearance:"auto"}}><option value="70">%70</option><option value="80">%80</option><option value="90">%90</option></select></div></div><div style={{marginTop:14}}><Btn primary full onClick={doA} disabled={ld}>{ld?"⏳...":"📐 Hesapla"}</Btn></div></Card>}
{/* CSV Upload */}
<Card style={{marginBottom:8,border:"2px dashed "+C.cb}}>
<div style={{fontSize:10,fontWeight:700,color:C.ac,marginBottom:6}}>📂 Veri Yükle ve Analiz Et (CSV)</div>
<input type="file" accept=".csv,.txt" onChange={e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>setCsvData(ev.target.result);r.readAsText(f);}} style={{fontSize:10,marginBottom:6,width:"100%"}}/>
{csvData&&<div style={{fontSize:8,color:"#16a34a",marginBottom:4}}>✓ {csvData.split("\n").length} satır yüklendi</div>}
<div style={{display:"flex",gap:4}}>
<Btn primary small full onClick={doAnalyze} disabled={!csvData||ld}>{ld?"⏳ Analiz ediliyor...":"🔬 Veriyi Analiz Et"}</Btn>
</div>
{csvResult&&!csvResult.noapi&&<div style={{marginTop:8,background:C.acL,borderRadius:8,padding:8,border:"1px solid "+C.ac+"30"}}>
<div style={{fontSize:10,fontWeight:700,color:C.ac,marginBottom:4}}>📊 Analiz Sonuçları</div>
{csvResult.summary&&<p style={{fontSize:9,color:C.txD,margin:"0 0 4px"}}><strong>Özet:</strong> {csvResult.summary}</p>}
{csvResult.descriptive&&<pre style={{fontFamily:"monospace",fontSize:7,background:C.card,padding:6,borderRadius:4,whiteSpace:"pre-wrap",margin:"0 0 4px",border:"1px solid "+C.cb,overflow:"auto",maxHeight:100}}>{csvResult.descriptive}</pre>}
{csvResult.interpretation&&<p style={{fontSize:9,color:C.txD,margin:"0 0 6px"}}><strong>Yorum:</strong> {csvResult.interpretation}</p>}
<Btn gold full small onClick={transferToArticle}>📄 Sonuçları Makaleye Aktar →</Btn>
</div>}
{csvResult?.noapi&&<div style={{marginTop:6,background:"#fef2f2",borderRadius:6,padding:8,border:"1px solid #fecaca",textAlign:"center"}}><div style={{fontSize:9,color:"#991b1b",fontWeight:600}}>⚠ {csvResult.msg}</div><div style={{fontSize:8,color:"#991b1b",marginTop:4}}>İletişim: info@hayrai.com</div></div>}
</Card>
{/* Quality for Analysis */}
<div style={{marginBottom:8}}><div style={{fontSize:9,fontWeight:600,color:C.ac,marginBottom:4}}>Kalite:</div><div style={{display:"flex",gap:4}}>{[{id:"temel",l:"Temel",i:"📝",ok:true},{id:"iyi",l:"İyi",i:"🤖",ok:apiSt.iyi},{id:"premium",l:"Premium",i:"👑",ok:apiSt.premium}].map(q=><button key={q.id} onClick={()=>setQl(q.id)} style={{flex:1,background:ql===q.id?"#1e40af":q.ok?"#fff":"#fef2f2",color:ql===q.id?"#fff":C.txD,border:"1.5px solid "+(ql===q.id?"transparent":C.cb),borderRadius:6,padding:"4px",fontSize:8,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}><span style={{fontSize:12}}>{q.i}</span> {q.l} {q.ok?<span style={{display:"inline-block",width:4,height:4,borderRadius:"50%",background:"#16a34a"}}/>:<span style={{display:"inline-block",width:4,height:4,borderRadius:"50%",background:"#dc2626"}}/>}</button>)}</div></div>
{/* Warning Modal */}
{apiWarn&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={()=>setApiWarn(null)}><div style={{background:C.card,borderRadius:12,padding:24,maxWidth:360,width:"90%",textAlign:"center"}} onClick={e=>e.stopPropagation()}><div style={{fontSize:36,marginBottom:8}}>⚠️</div><h3 style={{fontSize:15,color:"#dc2626",margin:"0 0 8px"}}>API Kullanılamıyor</h3><p style={{fontSize:11,color:C.txD,marginBottom:14,lineHeight:1.6}}>{apiWarn}</p><div style={{display:"flex",gap:6,justifyContent:"center"}}><Btn primary small onClick={()=>{setQl("temel");setApiWarn(null);}}>Temel Kullan</Btn><Btn small onClick={()=>setApiWarn(null)}>Kapat</Btn></div><p style={{fontSize:9,color:C.txD,marginTop:10}}>Abone olmak için: info@hayrai.com</p></div></div>}
{anType==="interpret"&&<Card>{[{t:"p Değeri",items:["p<.001 Çok yüksek","p<.05 Anlamlı","p>.05 Anlamsız"]},{t:"Cohen's d",items:["0.2 Küçük","0.5 Orta","0.8 Büyük"]},{t:"r",items:["<.30 Düşük",".30-.49 Orta",".50+ Yüksek"]},{t:"R²",items:["<.13 Düşük",".13-.26 Orta",">.26 Yüksek"]}].map((s,i)=><div key={i} style={{background:C.bg,borderRadius:8,padding:"8px 10px",marginBottom:6,border:`1px solid ${C.cb}`}}><h4 style={{fontSize:12,color:C.ac,margin:"0 0 4px",fontWeight:600}}>{s.t}</h4>{s.items.map((it,j)=><div key={j} style={{fontSize:11,color:C.txD}}>{it}</div>)}</div>)}</Card>}
{anType==="design"&&<Card>{[{q:"İlişki?",a:"Korelasyonel",t:"Pearson, Regresyon"},{q:"Fark?",a:"Deneysel",t:"t-testi, ANOVA"},{q:"Deneyim?",a:"Fenomenoloji",t:"Tematik Analiz"},{q:"Sentez?",a:"Sist. Derleme",t:"PRISMA"},{q:"Tek olay?",a:"Vaka",t:"Betimsel"}].map((r,i)=><div key={i} style={{background:C.bg,borderRadius:8,padding:"8px 10px",marginBottom:5,border:`1px solid ${C.cb}`}}><span style={{fontSize:12,fontWeight:500}}>{r.q}</span> <span style={{color:C.ac,fontWeight:600,fontSize:12}}>→ {r.a}</span> <span style={{fontSize:10,color:C.txD}}>({r.t})</span></div>)}</Card>}
{anR&&anR.type==="test"&&<Card style={{marginTop:16,background:C.acL}}><h3 style={{fontSize:14,color:C.ac,margin:"0 0 10px"}}>✅ Önerilen</h3>{anR.tests.map((t,i)=><div key={i} style={{background:C.card,borderRadius:8,padding:"12px",marginBottom:6,border:`1px solid ${C.cb}`}}><div style={{fontSize:14,fontWeight:700,color:C.ac,marginBottom:4}}>🥇 {t.name}</div><div style={{fontSize:11,color:C.txD,marginBottom:4}}>{t.why}</div>{t.soft&&<div style={{background:C.acL,borderRadius:6,padding:"5px 8px",fontSize:11,fontFamily:"monospace"}}>{t.soft}</div>}{t.report&&<div style={{background:C.goldL,borderRadius:6,padding:"5px 8px",fontSize:11,fontFamily:"monospace",marginTop:4}}>{t.report}</div>}</div>)}</Card>}
{anR&&anR.type==="sample"&&<Card style={{marginTop:16,background:C.acL}}><div style={{textAlign:"center",padding:"10px 0"}}><div style={{fontSize:42,fontWeight:700,color:C.ac,fontFamily:"'DM Serif Display',serif"}}>n = {anR.n}</div></div><div style={{background:C.card,borderRadius:8,padding:"6px 8px",fontSize:12,fontFamily:"monospace",marginBottom:6,border:`1px solid ${C.cb}`}}>{anR.formula}</div><div style={{fontSize:11,color:C.txD}}>{anR.note}</div></Card>}
</div></div>);

/* ═══ PRICING ═══ */
if(pg==="pricing")return(<div style={SS}><Eth/><TopNav go={go} title="💎 Planlar"/><div style={{maxWidth:960,margin:"0 auto",padding:"32px 20px"}}><h2 style={{textAlign:"center",fontSize:22,fontWeight:300,fontFamily:"'DM Serif Display',serif",marginBottom:24}}>Bireysel & Kurumsal</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(195px,1fr))",gap:12}}>{PLANS.map(p=><div key={p.id} style={{background:p.hl?C.hero:C.card,color:p.hl?"#fff":C.tx,borderRadius:12,padding:"22px 16px",border:p.hl?"none":p.id==="corp"?`2px solid ${C.gold}`:`1px solid ${C.cb}`,position:"relative",textAlign:"center",transform:p.hl?"scale(1.03)":"none",boxShadow:p.hl?"0 4px 24px rgba(30,90,150,0.2)":"none"}}>{p.badge&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:p.id==="corp"?`linear-gradient(135deg,${C.gold},#a57a0b)`:C.hero,color:"#fff",padding:"3px 10px",borderRadius:20,fontSize:9,fontWeight:700}}>{p.badge}</div>}<h3 style={{fontSize:14,fontWeight:600,marginBottom:4}}>{p.name}</h3><div style={{fontSize:24,fontWeight:700,color:p.hl?"#ffd76e":p.id==="corp"?C.gold:C.ac,fontFamily:"'DM Serif Display',serif"}}>{p.price}<span style={{fontSize:11,fontWeight:400,color:p.hl?"#b8d4ec":C.txD}}>{p.period}</span></div><ul style={{listStyle:"none",padding:0,margin:"10px 0",textAlign:"left"}}>{p.feat.map((f,i)=><li key={i} style={{padding:"2px 0",fontSize:10,color:p.hl?"#c5ddf0":C.txD,display:"flex",gap:5}}><span style={{color:p.hl?"#ffd76e":C.ac2}}>✓</span>{f}</li>)}</ul><Btn primary={p.hl} gold={p.id==="corp"} full small onClick={()=>{if(p.id==="corp"){alert("Kurumsal: info@hayrai.com");return;}setSelPlan(p);setShowPay(true);}}>{p.cta}</Btn></div>)}</div></div><PayModal plan={showPay?selPlan:null} onDone={()=>{setShowPay(false);setIsPrem(true);}} onCancel={()=>setShowPay(false)}/></div>);

/* ═══ RESULT ═══ */
if(pg==="result"&&art)return(<div style={SS}><Eth/>
<div style={{background:C.card,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,borderBottom:`1px solid ${C.cb}`}}><div style={{display:"flex",alignItems:"center",gap:12}}><button onClick={()=>go(art.type==="quick"?"quick":"detailed")} style={{background:"none",border:"none",color:C.ac,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>← Yeni</button><span style={{fontSize:17,fontFamily:"'DM Serif Display',serif"}}><span style={{color:C.ac,fontWeight:700}}>HayrAI</span></span></div><div style={{display:"flex",gap:6}}><Btn small onClick={()=>doPrint()}>📄 PDF</Btn><Btn small primary={isPrem} onClick={()=>!isPrem&&go("pricing")}>{isPrem?"📥 Word":"🔒 Premium"}</Btn></div></div>
<div style={{maxWidth:720,margin:"0 auto",padding:"16px 20px"}}><Card style={{background:C.goldL,border:"1px solid #e8d5a0",marginBottom:14,padding:"10px 14px"}}><p style={{fontSize:11,color:C.gold,margin:0}}>✍️ Bu taslak, araştırmanıza ilham ve yapı vermek içindir. <strong>Lütfen kendi özgün yazım tarzınızla yeniden oluşturun.</strong></p></Card>
{art.meta&&<div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>{[art.meta.dept,art.meta.meth,art.meta.cite].filter(Boolean).map((t,i)=><span key={i} style={{background:C.acL,color:C.ac,padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:600}}>{t}</span>)}</div>}
<div ref={aRef} style={{background:C.card,borderRadius:8,padding:"32px 28px",position:"relative",lineHeight:1.8,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",border:`1px solid ${C.cb}`,userSelect:"none",WebkitUserSelect:"none"}}><Wm/><div style={{position:"relative",zIndex:1,opacity:0.75}}><h1 style={{fontSize:16,textAlign:"center",fontWeight:700,marginBottom:16,fontFamily:"'DM Serif Display',serif"}}>{art.title}</h1><div style={{background:C.bg,padding:"12px 16px",borderRadius:6,marginBottom:16,borderLeft:`3px solid ${C.ac}`}}><strong style={{fontSize:11}}>ÖZET</strong><p style={{fontSize:12,margin:"4px 0 0",color:C.txD}}>{art.abstract}</p></div>{art.kw&&<div style={{marginBottom:16}}><strong style={{fontSize:10,color:C.txD}}>Anahtar Kelimeler: </strong>{art.kw.map((k,i)=><span key={i} style={{display:"inline-block",background:C.acL,padding:"2px 6px",borderRadius:4,fontSize:10,color:C.ac,margin:"2px 3px 2px 0"}}>{k}</span>)}</div>}<hr style={{border:"none",borderTop:`1px solid ${C.cb}`,margin:"16px 0"}}/>{art.secs.map((s,i)=><div key={i} style={{marginBottom:20}}><h2 style={{fontSize:13,fontWeight:700,borderBottom:`1px solid ${C.cb}`,paddingBottom:4,marginBottom:8,color:C.ac}}>{s.t}</h2><div style={{fontSize:12,color:"#333",whiteSpace:"pre-line",textAlign:"justify"}}>{typing?getVisibleText(s.c,art.secs):s.c}</div></div>)}</div></div>
{!isPrem&&<Card style={{marginTop:16,background:C.acL,textAlign:"center"}}><h3 style={{color:C.ac,fontSize:14,fontWeight:400,margin:"0 0 10px",fontFamily:"'DM Serif Display',serif"}}>Filigransız Word?</h3><div style={{display:"flex",gap:8,justifyContent:"center"}}><Btn primary small onClick={()=>{setSelPlan(PLANS[1]);setShowPay(true);}}>Aylık 149₺</Btn><Btn small gold onClick={()=>{setSelPlan(PLANS[2]);setShowPay(true);}}>Tek 299₺</Btn></div></Card>}
</div><PayModal plan={showPay?selPlan:null} onDone={()=>{setShowPay(false);setIsPrem(true);}} onCancel={()=>setShowPay(false)}/></div>);
/* ═══ ALTERNATIVES ═══ */
if(pg==="alts"&&alts)return(<div style={SS}><Eth/>
<TopNav go={go} title="📊 Alternatif Taslaklar"/>
<div style={{maxWidth:800,margin:"0 auto",padding:"20px"}}>
  <h2 style={{fontSize:20,fontWeight:300,fontFamily:"Georgia,serif",marginBottom:6}}>Farklı AI Modelleri ile Üretilen Taslaklar</h2>
  <p style={{color:C.txD,fontSize:12,marginBottom:6,lineHeight:1.6}}>Aşağıdaki taslakları karşılaştırın ve en uygun olanından ilham alarak <strong>kendi özgün çalışmanızı</strong> oluşturun.</p>
  <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
    <a href="https://www.springer.com/gp/editorial-policies/artificial-intelligence" target="_blank" rel="noopener" style={{fontSize:9,color:C.ac,textDecoration:"none",background:C.acL,padding:"3px 8px",borderRadius:10}}>📘 Springer AI Politikası</a>
    <a href="https://publicationethics.org/cope-position-statements/ai-author" target="_blank" rel="noopener" style={{fontSize:9,color:C.ac,textDecoration:"none",background:C.acL,padding:"3px 8px",borderRadius:10}}>📗 COPE AI Rehberi</a>
    <a href="https://www.tubitak.gov.tr" target="_blank" rel="noopener" style={{fontSize:9,color:C.ac,textDecoration:"none",background:C.acL,padding:"3px 8px",borderRadius:10}}>📕 TÜBİTAK</a>
    <a href="https://unesdoc.unesco.org/ark:/48223/pf0000381137" target="_blank" rel="noopener" style={{fontSize:9,color:C.ac,textDecoration:"none",background:C.acL,padding:"3px 8px",borderRadius:10}}>📙 UNESCO AI Etiği</a>
  </div>
  <div style={{display:"grid",gap:14}}>
    {alts.map((a,i)=>(
      <div key={i} style={{background:C.card,borderRadius:12,border:`1px solid ${C.cb}`,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
        <div style={{background:"linear-gradient(135deg,#0f172a,#1e3a5f)",padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <span style={{color:"#fbbf24",fontSize:13,fontWeight:700}}>Alternatif {i+1}</span>
            {a._p&&<span style={{color:"#94a3b8",fontSize:10,marginLeft:8}}>({a._p})</span>}
          </div>
          <button onClick={()=>{setArt(a);setVisChars(0);setTyping(true);go("result");}} style={{background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",border:"none",padding:"6px 16px",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Bu Taslağı Seç →</button>
        </div>
        <div style={{padding:"14px 16px"}}>
          <h3 style={{fontSize:14,fontWeight:600,color:C.tx,marginBottom:6,lineHeight:1.3}}>{a.title}</h3>
          <p style={{fontSize:11,color:C.txD,lineHeight:1.6,marginBottom:8}}>{a.abstract?.substring(0,250)}...</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:8}}>{(a.kw||[]).map((k,j)=><span key={j} style={{background:C.acL,color:C.ac,padding:"2px 6px",borderRadius:4,fontSize:9}}>{k}</span>)}</div>
          <div style={{fontSize:10,color:C.txD}}>
            <strong>Bölümler:</strong> {(a.secs||[]).map(s=>s.t).join(" → ")}
          </div>
        </div>
      </div>
    ))}
  </div>
  <div style={{marginTop:16,background:C.goldL,borderRadius:10,padding:"14px 16px",border:"1px solid #e8d5a0"}}>
    <p style={{fontSize:11,color:C.gold,margin:0,lineHeight:1.6}}>✍️ Bu taslaklar, araştırmanıza yön vermek ve yapı oluşturmak içindir. <strong>Lütfen seçtiğiniz taslağı kendi özgün yazım tarzınızla yeniden kaleme alın.</strong> AI destekli çalışmalarda <a href="https://publicationethics.org/cope-position-statements/ai-author" target="_blank" rel="noopener" style={{color:C.gold}}>COPE</a> ve <a href="https://www.springer.com/gp/editorial-policies/artificial-intelligence" target="_blank" rel="noopener" style={{color:C.gold}}>Springer</a> etik kurallarına uyun.</p>
  </div>
</div></div>);
/* ═══ ETHICS PAGE ═══ */
if(pg==="ethics")return(<div style={SS}><Eth/><TopNav go={go} title="📚 Etik AI Kullanım Rehberleri"/>
<div style={{maxWidth:700,margin:"0 auto",padding:"28px 20px"}}>
  <h2 style={{fontSize:22,fontWeight:300,fontFamily:"Georgia,serif",marginBottom:6}}>Akademik Yazımda Etik AI Kullanımı</h2>
  <p style={{color:C.txD,fontSize:13,marginBottom:20,lineHeight:1.7}}>Yapay zekâ destekli araçlar, akademik yazımda rehberlik amacıyla kullanılabilir. Ancak <strong>doğrudan kopya kullanımı etik ihlaldir.</strong> Aşağıdaki uluslararası rehberleri mutlaka inceleyin.</p>
  
  {[
    {title:"Springer — AI ve AI Destekli Teknolojiler Politikası",url:"https://www.springer.com/gp/editorial-policies/artificial-intelligence",desc:"Springer Nature, yazarların AI araçlarını şeffaf biçimde beyan etmesini zorunlu kılar. AI, yazar olarak listelenemez. Üretilen metnin sorumluluğu tamamen yazara aittir.",icon:"📘",color:"#2563eb"},
    {title:"COPE — Yapay Zekâ Araçları Hakkında Pozisyon Bildirisi",url:"https://publicationethics.org/cope-position-statements/ai-author",desc:"Committee on Publication Ethics (COPE), AI'nın yazarlık kriterlerini karşılamadığını belirtir. AI kullanımı methods bölümünde açıkça belirtilmelidir.",icon:"📗",color:"#16a34a"},
    {title:"UNESCO — Yapay Zekâ Etiği Tavsiye Kararı",url:"https://unesdoc.unesco.org/ark:/48223/pf0000381137",desc:"UNESCO'nun 193 üye devlet tarafından kabul edilen kapsamlı AI etiği çerçevesi. Şeffaflık, adalet, mahremiyet ve insan denetimi ilkelerini içerir.",icon:"📙",color:"#f59e0b"},
    {title:"TÜBİTAK — Araştırma ve Yayın Etiği",url:"https://www.tubitak.gov.tr/tr/destekler/akademik/arastirma-destek-programlari",desc:"TÜBİTAK'ın araştırma etiği ilkeleri ve Türkiye'deki akademik yayın standartları. Proje başvurularında etik beyan zorunluluğu.",icon:"📕",color:"#dc2626"},
    {title:"Elsevier — AI Kullanım Politikası",url:"https://www.elsevier.com/about/policies-and-standards/the-use-of-generative-ai-and-ai-assisted-technologies-in-writing-for-elsevier",desc:"Dünyanın en büyük akademik yayıncısı Elsevier, AI kullanımının beyan edilmesini ve yazarların tüm içerikten sorumlu olmasını zorunlu kılar.",icon:"📓",color:"#7c3aed"},
    {title:"Nature — AI Araçları Rehberi",url:"https://www.nature.com/nature-portfolio/editorial-policies/ai",desc:"Nature dergisi grubu, AI destekli metin ve görsellerin kullanımında tam şeffaflık bekler. AI yazar olarak kabul edilmez.",icon:"📔",color:"#0891b2"},
    {title:"Horizon Europe — AI Kullanım Beyanı",url:"https://www.emdesk.com/horizon-2020-horizon-europe-basics-guide/horizon-europe-using-ai-in-grant-proposal-writing-responsibly",desc:"AB Horizon Europe programında 2025'ten itibaren AI kullanım beyanı zorunludur. Kullanılan araçlar, kaynaklar ve sınırlılıklar belirtilmelidir.",icon:"🇪🇺",color:"#1e40af"}
  ].map((r,i)=>(
    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{display:"block",background:C.card,borderRadius:12,padding:"16px",marginBottom:10,border:"1px solid "+C.cb,textDecoration:"none",borderLeft:"4px solid "+r.color,boxShadow:"0 1px 4px rgba(0,0,0,0.04)",transition:"all .2s"}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
        <span style={{fontSize:24}}>{r.icon}</span>
        <div>
          <h3 style={{fontSize:14,fontWeight:600,color:r.color,margin:"0 0 4px"}}>{r.title}</h3>
          <p style={{fontSize:11,color:C.txD,margin:0,lineHeight:1.6}}>{r.desc}</p>
          <span style={{fontSize:10,color:r.color,marginTop:4,display:"inline-block"}}>Rehberi İncele →</span>
        </div>
      </div>
    </a>
  ))}
  
  <div style={{background:"linear-gradient(135deg,#0f172a,#1e3a5f)",borderRadius:12,padding:"20px",marginTop:16,color:"#fff",textAlign:"center"}}>
    <h3 style={{fontSize:16,fontWeight:300,fontFamily:"Georgia,serif",marginBottom:8}}>HayrAI Etik Taahhüdü</h3>
    <p style={{fontSize:12,color:"#cbd5e1",lineHeight:1.7,maxWidth:500,margin:"0 auto"}}>HayrAI, araştırmacı yerine makale yazmaz — <strong style={{color:"#fbbf24"}}>ilham verir, yapı önerir, rehberlik eder.</strong> Tüm çıktılar filigranla korunur ve "kendi yazım tarzınızla yeniden oluşturun" uyarısı ile sunulur. Platform, COPE ve UNESCO ilkeleriyle tam uyumludur.</p>
  </div>
</div></div>);
return null;}

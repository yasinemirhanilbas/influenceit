// Turkish UI text. Keep the same keys as locales/en.js.
// Placeholders like {price} are filled with interpolate() from locales/index.js.
const tr = {
  meta: {
    title: "InfluenceIt | İçerik üreticilerle çalış. Yalnızca onayladığında öde.",
    description:
      "Doğrulanmış içerik üreticileri bul, fiyatı baştan gör ve içeriği onaylayana kadar ödemeni güvencede tut.",
  },

  common: {
    brandName: "InfluenceIt",
    skipToContent: "İçeriğe geç",
    startAsBrand: "Marka olarak başla",
    joinAsCreator: "İçerik üretici olarak katıl",
    verified: "Doğrulanmış",
    verifiedProfile: "Doğrulanmış profil",
    fromPrice: "Başlangıç: {price} / gönderi",
    followers: "{count} takipçi",
    completed: "Tamamlandı",
    pending: "Bekliyor",
    yes: "Evet",
    no: "Hayır",
  },

  header: {
    supportHours: "Destek: hafta içi 09:00 – 18:00",
    tagline: "İçerik üretici pazar yeri",
    supportEmail: "hello@influenceit.example",
    signUp: "Kayıt ol",
    logIn: "Giriş yap",
    account: "Hesabım",
    mainNavLabel: "Ana gezinme",
    menu: "Menü",
    languageLabel: "Dil",
    closeMenu: "Menüyü kapat",
    links: [
      {
        label: "Nasıl çalışır",
        route: "howItWorks",
      },
      {
        label: "İçerik üreticiler",
        route: "creators",
      },
      {
        label: "Açık işler",
        route: "jobs",
      },
      {
        label: "Marka hikâyeleri",
        route: "stories",
      },
      {
        label: "SSS",
        route: "faq",
      },
    ],
  },

  hero: {
    eyebrow: "Markalar ve içerik üreticiler için",
    headlineLead: "İçerik üreticilerle çalış.",
    headlineEmphasis: "Yalnızca onayladığında öde.",
    subheadline:
      "Şeffaf fiyatlar, doğrulanmış profiller ve içerik teslim edilene kadar güvende bekleyen ödemen.",
    brandHint: "İçerik üretici bul, dakikalar içinde sipariş ver.",
    creatorHint: "Keşfedil, onay gelince ödemeni al.",
    trustItems: ["Doğrulanmış profiller", "Sabit fiyatlar", "Ödeme güvencede"],
    twoSided: "Markalar içerik üreticileri bulur. İçerik üreticiler de markaları.",
    browseJobs: "Açık işlere göz at",
    chipVerified: "Doğrulanmış içerik üretici",
    chipPending: "Ödeme bekleniyor",
    chipProtected: "{amount} güvencede",
    chipPaid: "{amount} ödendi",
  },

  receipt: {
    title: "Sipariş makbuzu",
    orderNumber: "Sipariş #{number}",
    packageLabel: "Paket",
    packageName: "1 Reel + 3 Story",
    priceLabel: "Fiyat",
    feeLabel: "Platform ücreti",
    feeValue: "Dahil",
    totalLabel: "Toplam",
    stampHeld: "Güvencede",
    stampReleased: "Serbest",
    stampOrdered: "Sipariş verildi",
    timelineLabel: "Sipariş ilerlemesi",
    steps: [
      "Sipariş verildi",
      "Ödeme güvencede bekliyor",
      "İçerik teslim edildi",
      "Onayla, ödeme serbest kalsın",
    ],
    footnoteWaiting: "Sen onaylarsın. Sonra içerik üretici ödemesini alır.",
    footnoteDone: "Onaylandı. İçerik üretici ödemesini aldı.",
  },

  brandStrip: {
    label: "Her ölçekten marka burada içerik üreticilerle çalışıyor",
    note: "Örnek marka isimleri. Hepsi kurgusal.",
  },

  howItWorks: {
    eyebrow: "Nasıl çalışır",
    heading: "Aramadan ödemeye dört adımda",
    subheading: "Paran yalnızca sen söylediğinde hareket eder.",
    stepLabel: "Adım {number}",
    escrowTag: "Güvence",
    tabsLabel: "Tarafını seç",
    tabBrands: "Markalar için",
    tabCreators: "İçerik üreticiler için",
    paidTag: "Ödeme",
    seeFull: "Tüm rehberi gör",
    creatorSteps: [
      {
        title: "Profilini oluştur",
        description: "Nişini, kitleni ve sabit fiyatlı paketlerini ekle. Doğrulanmış rozetini al.",
      },
      {
        title: "Bulun ya da başvur",
        description: "Markalar profilinden sipariş verir ya da sen sana uygun açık işlere başvurursun.",
      },
      {
        title: "İçeriği teslim et",
        description: "Net bir brief'e göre çalış. Ödeme zaten güvencede bekliyor.",
      },
      {
        title: "Ödemeni al",
        description: "Marka onayladığında ödemen sana aktarılır.",
      },
    ],
    steps: [
      {
        title: "Ara",
        description:
          "Niş, kitle büyüklüğü ve fiyata göre doğrulanmış içerik üreticilere göz at.",
      },
      {
        title: "Sipariş ver",
        description:
          "Sabit fiyatlı bir paket seç ve kısa bir brief gönder. Pazarlık yok.",
      },
      {
        title: "Güvenle öde",
        description:
          "Ödemen güvencede bekler, böylece içerik üretici içeriğe gönül rahatlığıyla başlar.",
      },
      {
        title: "Teslim al ve onayla",
        description:
          "İçeriği incele. Ödemeyi serbest bırakmak için onayla ya da revizyon iste.",
      },
    ],
  },

  stats: {
    eyebrow: "Rakamlarla",
    heading: "Rakamlarla InfluenceIt",
    note: "Bu prototip için örnek rakamlar.",
    items: {
      deliveryDays: "siparişten teslime ortalama gün",
      approvalRate: "itirazsız onaylanan siparişler",
      verifiedCreators: "doğrulanmış içerik üretici",
      openJobs: "markalardan açık iş",
      escrowShare: "güvencede tutulan ödemeler",
    },
  },

  featured: {
    eyebrow: "Öne çıkan içerik üreticiler",
    heading: "Çalışmaya hazır içerik üreticiler",
    subheading: "Her profil doğrulanmış. Her fiyat sabit.",
    browseAll: "Tüm içerik üreticilere göz at",
    filterLabel: "İçerik üreticileri nişe göre filtrele",
    allNiches: "Tümü",
    niches: {
      Beauty: "Güzellik",
      Tech: "Teknoloji",
      Food: "Yemek",
      Fitness: "Fitness",
      Travel: "Seyahat",
      Home: "Ev",
    },
    resultCount: "{count} içerik üretici gösteriliyor",
    ratingLabel: "5 üzerinden {rating} puan",
    orders: "{count} sipariş",
    delivery: "{days} günde teslim",
    tiers: {
      micro: "Mikro",
      mid: "Orta ölçek",
      macro: "Makro",
    },
  },

  profile: {
    back: "Tüm içerik üreticiler",
    metaTitle: "{name} | InfluenceIt",
    statsLabel: "İçerik üretici istatistikleri",
    followers: "Takipçi",
    rating: "Puan",
    completed: "Tamamlanan sipariş",
    delivery: "Ortalama teslimat",
    deliveryValue: "{days} gün",
    aboutHeading: "Hakkında",
    packagesHeading: "Paketler",
    packagesNote: "Fiyatlar sabit. Ödemen, içeriği onaylayana kadar emanette tutulur.",
    packageDelivery: "{days} günde teslim",
    order: "Bu paketi sipariş et",
    orderHint: "Sipariş vermek için marka hesabı gerekir. Kayıt bir dakika sürer.",
    cities: { Istanbul: "İstanbul", Ankara: "Ankara", Izmir: "İzmir", Bursa: "Bursa", Antalya: "Antalya" },
  },

  comparison: {
    eyebrow: "Neden InfluenceIt",
    heading: "Sözlü anlaşmadan çok daha güvenli",
    subheading: "Ödeme işin bitmesini beklediğinde neler değişiyor, gör.",
    featureColumn: "Özellik",
    usColumn: "InfluenceIt",
    othersColumn: "Doğrudan anlaşma",
    manual: "Elle",
    rows: [
      { label: "Sen onaylayana kadar ödeme güvencede", us: "yes", others: "no" },
      { label: "Baştan görünen sabit fiyatlar", us: "yes", others: "no" },
      { label: "Doğrulanmış içerik üretici profilleri", us: "yes", others: "no" },
      { label: "Brief, teslim ve revizyonlar tek yerde", us: "yes", others: "no" },
      { label: "Revizyon talebi hazır geliyor", us: "yes", others: "manual" },
      { label: "Her siparişin net kaydı", us: "yes", others: "manual" },
      { label: "Başlamadan ödeme güvencede", us: "yes", others: "no" },
      { label: "Markalar seni bulur, sen de işlere başvurursun", us: "yes", others: "no" },
    ],
  },

  testimonials: {
    eyebrow: "Marka hikâyeleri",
    heading: "Markalar ilk siparişten sonra ne diyor",
    note: "Bu prototipteki kurgusal markalardan örnek alıntılar.",
    items: {
      northloom: {
        quote:
          "Fiyatı gördük, güvenceye ödedik ve reel'i ilk seferde onayladık. Fatura için kimsenin peşinden koşmadık.",
        role: "Kurucu",
      },
      "tamarind-lane": {
        quote:
          "Onayımızı verene kadar paranın beklediğini bilmek, ilk içerik üretici kampanyamızı riskli değil güvenli hissettirdi.",
        role: "Büyüme Direktörü",
      },
      "kiln-and-co": {
        quote:
          "Doğrulanmış profiller ve sabit paketler sayesinde sürpriz ek ücret çıkmadı. Son fatura tekliften farklı değildi.",
        role: "Sahibi",
      },
    },
    metricLabels: {
      deliveryDays: "siparişten teslime gün",
      reviewRounds: "onay için gereken inceleme turu",
      surpriseFees: "son faturada sürpriz ücret",
    },
  },

  faq: {
    eyebrow: "SSS",
    heading: "Merak edilenler",
    subheading: "Ödeme, fiyat ve onay hakkında kısa cevaplar.",
    items: [
      {
        question: "\"Güvencede bekleyen ödeme\" ne demek?",
        answer:
          "Sipariş verdiğinde ödemen korumalı bir bekletmeye alınır. İçerik üretici ödemenin güvende olduğunu görür ama sen içeriği onaylamadan alamaz.",
      },
      {
        question: "İçerik üretici ödemesini ne zaman alır?",
        answer:
          "Teslim edilen içeriği onayladığın anda. Revizyon istersen ödeme, düzeltilmiş içerik onaylanana kadar beklemeye devam eder.",
      },
      {
        question: "İçeriği beğenmezsem ne olur?",
        answer:
          "Kısa bir notla revizyon iste. İçerik üretici içeriği günceller ve yeniden teslim eder. Bu sürede ödemen serbest bırakılmaz.",
      },
      {
        question: "Fiyatlar nasıl belirleniyor?",
        answer:
          "İçerik üreticiler sabit fiyatlı paketler yayınlar. Sipariş vermeden önce fiyatı görürsün; pazarlık da sürpriz ek ücret de yok.",
      },
      {
        question: "İçerik üreticiler nasıl doğrulanıyor?",
        answer:
          "Her profil, Doğrulanmış rozetini almadan önce kontrol edilir. Böylece hesabın ve kitle sayılarının gerçek bir içerik üreticiye ait olduğunu bilirsin.",
      },
      {
        question: "Bu canlı bir hizmet mi?",
        answer:
          "Hayır. InfluenceIt bir prototiptir. Ödemeler, içerik üreticiler, markalar ve alıntılar kurgusaldır; burada gerçek para hareket etmez.",
      },
      {
        question: "İçerik üreticiler markalara ulaşabilir mi?",
        answer: "Evet. Açık işler sayesinde içerik üreticiler markalara doğrudan ulaşır. Kısa bir notla ve paketlerinden biriyle başvurursun, marka kiminle çalışacağına karar verir.",
      },
      {
        question: "İçerik üreticiler katılmak için ödeme yapar mı?",
        answer: "Bu prototipte katılmak ücretsizdir. Platform ücreti her paket fiyatına zaten dahildir.",
      },
    ],
  },

  gallery: {
    eyebrow: "İçerik formatları",
    heading: "Markaların sipariş ettiği içerikler",
    subheading: "Nişinize uygun içerik üreticilerden kısa videolar, eğitimler ve incelemeler.",
    listLabel: "Örnek içerik formatları, daha fazlası için yana kaydırın",
    note: "Yer tutucu görseller. İçerik üreticiler katıldığında gerçek çalışmalar burada görünecek.",
    tiles: {
      unboxing: { format: "Kutu açılımı", niche: "Tech" },
      tutorial: { format: "Eğitim videosu", niche: "Beauty" },
      tasting: { format: "Tadım testi", niche: "Food" },
      workout: { format: "Antrenman", niche: "Fitness" },
      vlog: { format: "Seyahat vlogu", niche: "Travel" },
      roomTour: { format: "Oda turu", niche: "Home" },
    },
  },

  jobs: {
    eyebrow: "Açık işler",
    heading: "Markalar seni arıyor",
    subheading: "Nişine uygun bir brief seç ve bir dakikada başvur.",
    browseAll: "Tüm açık işleri gör",
    budgetLabel: "Bütçe",
    delivery: "{days} günde teslim",
    applicants: "{count} başvuru",
    apply: "Hemen başvur",
    filterLabel: "İşleri nişe göre filtrele",
    allNiches: "Tümü",
    resultCount: "{count} iş gösteriliyor",
    noResults: "Bu nişte şu an açık iş yok.",
    note: "Kurgusal markalardan örnek işler.",
    listLabel: "Markalardan açık işler",
    formats: {
      reelStories: "1 Reel + 3 Story",
      tutorial: "Eğitim videosu",
      review: "Dürüst inceleme",
      unboxing: "Kutu açılımı videosu",
      vlog: "Kısa vlog",
      photoSet: "Fotoğraf seti",
    },
  },

  pages: {
    creators: {
      title: "İçerik üreticiler | InfluenceIt",
      description: "Doğrulanmış içerik üreticileri ara ve sabit fiyatları karşılaştır.",
      eyebrow: "İçerik üreticiler",
      heading: "Doğru içerik üreticiyi bul",
      subheading: "Doğrulanmış içerik üreticileri ara ve sabit fiyatları karşılaştır.",
      searchLabel: "İçerik üretici ara",
      searchPlaceholder: "İsim ya da kullanıcı adıyla ara",
      noResults: "Aramana uyan içerik üretici yok.",
      count: "{count} içerik üretici",
    },
    jobs: {
      title: "Açık işler | InfluenceIt",
      description: "Markalardan açık brief'ler. Nişine uyanlara başvur.",
      eyebrow: "Açık işler",
      heading: "Markalardan açık işler",
      subheading: "Nişine uygun brief'lere başvur. Marka kiminle çalışacağını seçer.",
    },
    howItWorks: {
      title: "Nasıl çalışır | InfluenceIt",
      description: "Markalar ve içerik üreticiler için aynı güvenli akış: güvence, sabit fiyat ve onay.",
      eyebrow: "Nasıl çalışır",
      heading: "InfluenceIt nasıl çalışır",
      subheading: "Markalar ve içerik üreticiler için aynı güvenli akış.",
    },
    login: {
      title: "Giriş yap | InfluenceIt",
      description: "Marka ya da içerik üretici hesabına giriş yap.",
      eyebrow: "Tekrar hoş geldin",
      heading: "Giriş yap",
      subheading: "Hesabının e-posta ve şifresiyle giriş yap.",
    },
    signup: {
      title: "Kayıt ol | InfluenceIt",
      description: "InfluenceIt'e marka ya da içerik üretici olarak katıl.",
    },
    industry: "Sektör",
    city: "Şehir",
    cityPlaceholder: "Şehir seç",
    submitting: "Hesabın oluşturuluyor...",
    errors: {
      name: "Lütfen adını ve soyadını gir.",
      email: "Lütfen geçerli bir e-posta adresi gir.",
      password: "Şifren en az 8 karakter olmalı.",
      terms: "Devam etmek için koşulları kabul etmelisin.",
      emailTaken: "Bu e-posta ile zaten bir hesap var. Giriş yapmayı dene.",
      niche: "Lütfen bir nişe seç.",
      company: "Lütfen marka adını gir.",
      handle: "Kullanıcı adın için 2 ile 30 arasında harf, rakam, nokta veya alt çizgi kullan.",
      city: "Lütfen bir şehir seç.",
      generic: "Bir şeyler ters gitti. Lütfen tekrar dene.",
    },
  },

  signup: {
    eyebrow: "Katıl",
    heading: "Hesabını oluştur",
    subheading: "Tarafını seç. Bir dakika sürer.",
    roleLabel: "Hesap türü",
    roleBrand: "Marka",
    roleCreator: "İçerik üretici",
    hintBrand: "İçerik üretici bul, dakikalar içinde sipariş ver.",
    hintCreator: "Keşfedil ve açık işlere başvur.",
    name: "Adın",
    email: "E-posta",
    company: "Marka adı",
    niche: "Ana niş",
    nichePlaceholder: "Bir niş seç",
    handle: "Sosyal medya kullanıcı adı",
    handlePlaceholder: "@kullaniciadin",
    roleBrandText: "İçerik üreticilerle çalış, yalnızca onayladığında öde.",
    roleCreatorText: "İçerik üret, markalardan kazan.",
    firstName: "Adın",
    lastName: "Soyadın",
    passwordLabel: "Şifre",
    passwordHint: "En az 8 karakter",
    terms: "Kullanım Koşulları ve Gizlilik Politikası'nı okudum, kabul ediyorum.",
    termsLinkTerms: "Kullanım Koşulları",
    termsLinkPrivacy: "Gizlilik Politikası",
    infoBrand: "Kayıt olduktan sonra marka profilini hazırlayabilir ve açık iş yayınlayabilirsin.",
    infoCreator: "Kayıt olduktan sonra profil sayfandan sosyal medya hesaplarını ve içerik kategorilerini ekleyebilirsin.",
    haveAccount: "Zaten hesabın var mı?",
    logIn: "Giriş yap",
    submit: "Hesabımı oluştur",
    note: "Prototip: tüm hesaplar ve veriler bu bilgisayarda kalır.",
  },

  login: {
    brandTitle: "Marka hesabı",
    brandText: "Siparişlerini, içerik üreticilerini ve ödemelerini yönet.",
    creatorTitle: "İçerik üretici hesabı",
    creatorText: "Profilini, işlerini ve ödemelerini yönet.",
    email: "E-posta",
    password: "Şifre",
    submit: "Giriş yap",
    noAccount: "Henüz hesabın yok mu?",
    signUp: "Kayıt ol",
    submitting: "Giriş yapılıyor...",
    errors: { invalid: "E-posta veya şifre hatalı." },
    demoAccounts: "Demo hesaplar (şifre demo1234): mira-solis@example.com bir içerik üreticidir, northloom-coffee@example.com bir markadır.",
  },

  packages: {
    title: "Paketlerim | InfluenceIt",
    eyebrow: "Hesabım",
    heading: "Paketlerim",
    subheading: "Sunduğun işler için sabit fiyatlar belirle. Markalar bu paketleri doğrudan sipariş eder.",
    loading: "Paketlerin yükleniyor...",
    hiddenNote: "İlk paketini ekleyene kadar profilin içerik üretici listesinde görünmez.",
    liveNote: "Profilin listede görünüyor. Değişiklikler herkese açık profilinde hemen yansır.",
    emptyList: "Henüz paketin yok. İlkini aşağıdan ekle.",
    addHeading: "Paket ekle",
    limitReached: "En fazla {max} paket ekleyebilirsin. Yeni eklemek için birini sil.",
    nameLabel: "Paket adı",
    namePlaceholder: "Örneğin: 1 Reel + 3 Hikaye",
    descriptionLabel: "Pakette neler var",
    descriptionPlaceholder: "Markanın ne alacağını anlat.",
    priceLabel: "Fiyat (Türk lirası, TRY)",
    daysLabel: "Teslim süresi (gün)",
    add: "Paketi ekle",
    adding: "Ekleniyor...",
    added: "Paket eklendi. Artık herkese açık profilinde.",
    edit: "Düzenle",
    save: "Değişiklikleri kaydet",
    saving: "Kaydediliyor...",
    cancel: "Vazgeç",
    delete: "Sil",
    deleteConfirm: "Evet, sil",
    deleting: "Siliniyor...",
    hasOrdersNote: "Bu pakette sipariş var, bu yüzden silinemez.",
    back: "Hesabıma dön",
    viewProfile: "Herkese açık profilimi gör",
    errors: {
      name: "En fazla 40 karakterlik bir paket adı gir.",
      description: "Paketi en fazla 160 karakterle anlat.",
      price: "1 ile 1.000.000 arasında tam sayı bir fiyat gir.",
      days: "1 ile 30 gün arasında bir teslim süresi gir.",
      limit: "En fazla paket sayısına ulaştın.",
      notFound: "Bu paket bulunamadı. Sayfayı yenileyip tekrar dene.",
      hasOrders: "Bu pakette sipariş var, bu yüzden silinemez.",
      forbidden: "Paketleri yalnızca içerik üretici hesapları yönetebilir. Lütfen yeniden giriş yap.",
      generic: "Bir şeyler ters gitti. Lütfen tekrar dene.",
    },
  },

  account: {
    title: "Hesabım | InfluenceIt",
    eyebrow: "Hesabım",
    welcome: "Hoş geldin, {name}",
    roleBrand: "Marka hesabı",
    roleCreator: "İçerik üretici hesabı",
    emailLabel: "E-posta",
    companyLabel: "Marka",
    industryLabel: "Sektör",
    handleLabel: "Kullanıcı adı",
    nicheLabel: "Niş",
    cityLabel: "Şehir",
    jobsLabel: "Yayınlanan açık iş",
    ordersLabel: "Sipariş",
    applicationsLabel: "Gönderilen başvuru",
    brandNext: "Bir içerik üretici bul ve paket sipariş et.",
    creatorNext: "Açık işlere göz at ve başvur.",
    creatorNoPackages: "İlk paketini ekleyene kadar profilin içerik üretici listesinde görünmez.",
    managePackages: "Paketlerimi yönet",
    findCreators: "İçerik üreticilere göz at",
    browseJobs: "Açık işlere göz at",
    viewProfile: "Herkese açık profilimi gör",
    logOut: "Çıkış yap",
    loading: "Hesabın yükleniyor...",
  },

  notFound: {
    heading: "Bu sayfa mevcut değil",
    text: "Adres yanlış yazılmış olabilir ya da sayfa taşınmış olabilir.",
    home: "Ana sayfaya dön",
    jobs: "Açık işlere göz at",
  },

  footer: {
    tagline: "İçerik üreticileri bulun. Yalnızca onayladığınızda ödeyin.",
    navTitle: "Keşfet",
    contactTitle: "İletişim",
    note: "InfluenceIt bir demo prototipidir. Tüm kişiler, markalar ve rakamlar kurgusaldır.",
    backToTop: "Başa dön",
  },

  cta: {
    heading: "Hazır olduğunda buradayız",
    subheading: "Tarafını seç. İkisi de bir dakikada başlar.",
    brand: {
      title: "Markalar için",
      description:
        "Doğrulanmış bir içerik üretici bul, fiyatı baştan gör ve yalnızca içeriği onayladığında öde.",
    },
    creator: {
      title: "İçerik üreticiler için",
      description:
        "Fiyatlarını bir kez belirle, net brief'ler al ve marka onayladığında ödemeni al.",
    },
    prototypeNote:
      "InfluenceIt bir prototiptir. Tüm içerik üreticiler, markalar ve alıntılar kurgusaldır.",
  },
};

export default tr;

// Allowed values for sign-up choices. Labels come from locales (featured.niches, profile.cities).
// Sectors a brand can pick when signing up (labels: signup.sectors). The first six ids are the same as NICHES.
export const BRAND_SECTORS = ["Beauty", "Fashion", "Tech", "Food", "Fitness", "Home", "Travel", "Education", "Finance", "Ecommerce", "Other"];
export const COMPANY_TITLE_MAX = 100;
export const NICHES = ["Beauty", "Tech", "Food", "Fitness", "Travel", "Home"];
// The 81 provinces of Turkey (ASCII ids; labels in locales profile.cities, sorted by the form in the user's language).
export const CITIES = [
  "Adana",
  "Adiyaman",
  "Afyonkarahisar",
  "Agri",
  "Aksaray",
  "Amasya",
  "Ankara",
  "Antalya",
  "Ardahan",
  "Artvin",
  "Aydin",
  "Balikesir",
  "Bartin",
  "Batman",
  "Bayburt",
  "Bilecik",
  "Bingol",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Bursa",
  "Canakkale",
  "Cankiri",
  "Corum",
  "Denizli",
  "Diyarbakir",
  "Duzce",
  "Edirne",
  "Elazig",
  "Erzincan",
  "Erzurum",
  "Eskisehir",
  "Gaziantep",
  "Giresun",
  "Gumushane",
  "Hakkari",
  "Hatay",
  "Igdir",
  "Isparta",
  "Istanbul",
  "Izmir",
  "Kahramanmaras",
  "Karabuk",
  "Karaman",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kirikkale",
  "Kirklareli",
  "Kirsehir",
  "Kilis",
  "Kocaeli",
  "Konya",
  "Kutahya",
  "Malatya",
  "Manisa",
  "Mardin",
  "Mersin",
  "Mugla",
  "Mus",
  "Nevsehir",
  "Nigde",
  "Ordu",
  "Osmaniye",
  "Rize",
  "Sakarya",
  "Samsun",
  "Siirt",
  "Sinop",
  "Sivas",
  "Sanliurfa",
  "Sirnak",
  "Tekirdag",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Usak",
  "Van",
  "Yalova",
  "Yozgat",
  "Zonguldak",
];

// Content categories a creator can pick at sign-up (several allowed). Labels: locales `categories`.
export const CATEGORIES = [
  "Family", "MomBaby", "Astrology", "Athletics", "Skincare", "Other", "Pets", "Fitness",
  "CurrentAffairs", "DailyLife", "DIY", "Cosmetics", "Places", "Architecture", "Humor", "Fashion",
  "Automotive", "Gaming", "Toys", "MakingMoney", "Art", "HealthyLiving", "Travel", "StreetEvents",
  "SurpriseBox", "Cleaning", "GenderStudies", "AI", "Food", "Business",
];
// Social platforms a creator can list at sign-up.
export const PLATFORMS = ["instagram", "tiktok", "youtube", "x", "kick"];
export const USERNAME_PATTERN = /^[A-Za-z0-9._]{1,30}$/;
// Per platform; four platforms together must still fit in a 32-bit integer (CreatorProfile.followers is their sum).
export const FOLLOWERS_MAX = 500_000_000;
export const GENDERS = ["female", "male", "other", "preferNotToSay"];

// Creator photo limits: one required profile photo plus up to GALLERY_MAX extra photos.
export const GALLERY_MAX = 3;
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
export const ABOUT_MAX = 500;

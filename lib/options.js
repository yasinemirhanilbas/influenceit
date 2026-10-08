// Allowed values for sign-up choices. Labels come from locales (featured.niches, profile.cities).
export const NICHES = ["Beauty", "Tech", "Food", "Fitness", "Travel", "Home"];
export const CITIES = ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya"];

// Limits for creator packages (checked on the server, reused as input limits in the form).
export const PACKAGE_LIMITS = {
  maxPackages: 6,
  nameMax: 40,
  descriptionMax: 160,
  priceMax: 1000000, // whole TRY
  daysMax: 30,
};

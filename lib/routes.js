import { getMessages } from "@/locales";

// Central place for link targets, prefixed with the current language.
export function getRoutes(lang) {
  return {
    home: `/${lang}`,
    creators: `/${lang}/creators`,
    browseCreators: `/${lang}/creators`,
    jobs: `/${lang}/jobs`,
    login: `/${lang}/login`,
    howItWorks: `/${lang}/how-it-works`,
    stories: `/${lang}#stories`,
    faq: `/${lang}/how-it-works#faq`,
    creatorProfile: (slug) => `/${lang}/creators/${slug}`,
    account: `/${lang}/account`,
    terms: `/${lang}/terms`,
    privacy: `/${lang}/privacy`,
    messages: `/${lang}/messages`,
    message: (id) => `/${lang}/messages/${id}`,
    orders: `/${lang}/orders`,
    order: (id) => `/${lang}/orders/${id}`,
    newOrder: (packageId) => `/${lang}/orders/new?package=${packageId}`,
    packages: `/${lang}/account/packages`,
    newJob: `/${lang}/jobs/new`,
    job: (id) => `/${lang}/jobs/${id}`,
    signUp: `/${lang}/signup`,
    signUpBrand: `/${lang}/signup?role=brand`,
    signUpCreator: `/${lang}/signup?role=creator`,
  };
}

// Main navigation: labels come from the locale files, targets from getRoutes.
export function getNavLinks(lang) {
  const routes = getRoutes(lang);
  return getMessages(lang).header.links.map((link) => ({
    label: link.label,
    route: link.route,
    href: routes[link.route],
  }));
}

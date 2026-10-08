// All user-facing text lives here so more languages can be added later.
// Placeholders like {price} are filled with interpolate() from locales/index.js.
const en = {
  meta: {
    title: "InfluenceIt | Hire creators. Pay only when you approve.",
    description:
      "Find verified creators, see fixed prices up front, and keep your payment safe in escrow until you approve the content.",
  },

  common: {
    brandName: "InfluenceIt",
    skipToContent: "Skip to content",
    startAsBrand: "Start as a brand",
    joinAsCreator: "Join as a creator",
    verified: "Verified",
    verifiedProfile: "Verified profile",
    fromPrice: "From {price} / post",
    followers: "{count} followers",
    completed: "Completed",
    pending: "Pending",
    yes: "Yes",
    no: "No",
  },

  header: {
    supportHours: "Support: weekdays 09:00 to 18:00",
    tagline: "Creator marketplace",
    supportEmail: "hello@influenceit.example",
    signUp: "Sign up",
    logIn: "Log in",
    account: "My account",
    mainNavLabel: "Main navigation",
    menu: "Menu",
    languageLabel: "Language",
    closeMenu: "Close menu",
    links: [
      {
        label: "How it works",
        route: "howItWorks",
      },
      {
        label: "Creators",
        route: "creators",
      },
      {
        label: "Open jobs",
        route: "jobs",
      },
      {
        label: "Brand stories",
        route: "stories",
      },
      {
        label: "FAQ",
        route: "faq",
      },
    ],
  },

  hero: {
    eyebrow: "For brands and creators",
    headlineLead: "Hire creators.",
    headlineEmphasis: "Pay only when you approve.",
    subheadline:
      "Transparent prices, verified profiles, and your payment held safely until the content is delivered.",
    brandHint: "Find creators and order in minutes.",
    creatorHint: "Get discovered and paid on approval.",
    trustItems: ["Verified profiles", "Fixed prices", "Payment held in escrow"],
    twoSided: "Brands find creators. Creators find brands.",
    browseJobs: "Browse open jobs",
    chipVerified: "Verified creator",
    chipPending: "Awaiting payment",
    chipProtected: "{amount} protected",
    chipPaid: "{amount} paid out",
  },

  receipt: {
    title: "Order receipt",
    orderNumber: "Order #{number}",
    packageLabel: "Package",
    packageName: "1 Reel + 3 Stories",
    priceLabel: "Price",
    feeLabel: "Platform fee",
    feeValue: "Included",
    totalLabel: "Total",
    stampHeld: "Held in escrow",
    stampReleased: "Released",
    stampOrdered: "Order placed",
    timelineLabel: "Order progress",
    steps: [
      "Order placed",
      "Payment held in escrow",
      "Content delivered",
      "Released on approval",
    ],
    footnoteWaiting: "You approve. Then the creator is paid.",
    footnoteDone: "Approved. The creator has been paid.",
  },

  brandStrip: {
    label: "Brands of every size work with creators here",
    note: "Sample brand names. All fictional.",
  },

  howItWorks: {
    eyebrow: "How it works",
    heading: "From search to payout in four steps",
    subheading: "Your money only moves when you say so.",
    stepLabel: "Step {number}",
    escrowTag: "Escrow",
    tabsLabel: "Choose your side",
    tabBrands: "For brands",
    tabCreators: "For creators",
    paidTag: "Paid",
    seeFull: "See the full guide",
    creatorSteps: [
      {
        title: "Create your profile",
        description: "Add your niche, audience and fixed-price packages. Get a Verified badge.",
      },
      {
        title: "Get found or apply",
        description: "Brands order from your profile, or you apply to open jobs that fit you.",
      },
      {
        title: "Deliver the content",
        description: "Work from a clear brief. The payment is already held in escrow.",
      },
      {
        title: "Get paid",
        description: "When the brand approves, your payment is released to you.",
      },
    ],
    steps: [
      {
        title: "Search",
        description:
          "Browse verified creators by niche, audience size and price.",
      },
      {
        title: "Order",
        description:
          "Pick a fixed-price package and send a short brief. No haggling.",
      },
      {
        title: "Pay securely",
        description:
          "Your payment is held in escrow, so the creator can start with confidence.",
      },
      {
        title: "Deliver and approve",
        description:
          "Review the content. Approve to release payment, or ask for a revision.",
      },
    ],
  },

  stats: {
    eyebrow: "By the numbers",
    heading: "InfluenceIt in numbers",
    note: "Sample figures for this prototype.",
    items: {
      deliveryDays: "average days from order to delivery",
      approvalRate: "of orders approved without a dispute",
      verifiedCreators: "verified creators",
      openJobs: "open jobs from brands",
      escrowShare: "of payments held in escrow",
    },
  },

  featured: {
    eyebrow: "Featured creators",
    heading: "Creators ready to work",
    subheading: "Every profile is verified. Every price is fixed.",
    browseAll: "Browse all creators",
    filterLabel: "Filter creators by niche",
    allNiches: "All",
    niches: {
      Beauty: "Beauty",
      Tech: "Tech",
      Food: "Food",
      Fitness: "Fitness",
      Travel: "Travel",
      Home: "Home",
    },
    resultCount: "{count} creators shown",
    ratingLabel: "Rated {rating} out of 5",
    orders: "{count} orders",
    delivery: "{days}-day delivery",
    tiers: {
      micro: "Micro",
      mid: "Mid-tier",
      macro: "Macro",
    },
  },

  profile: {
    back: "All creators",
    metaTitle: "{name} | InfluenceIt",
    statsLabel: "Creator statistics",
    followers: "Followers",
    rating: "Rating",
    completed: "Completed orders",
    delivery: "Average delivery",
    deliveryValue: "{days} days",
    aboutHeading: "About",
    packagesHeading: "Packages",
    packagesNote: "Prices are fixed. Your payment is held in escrow until you approve the content.",
    packageDelivery: "{days}-day delivery",
    order: "Order this package",
    orderHint: "Ordering needs a brand account. Sign-up takes a minute.",
    cities: { Istanbul: "Istanbul", Ankara: "Ankara", Izmir: "Izmir", Bursa: "Bursa", Antalya: "Antalya" },
  },

  comparison: {
    eyebrow: "Why InfluenceIt",
    heading: "Safer than a handshake deal",
    subheading: "See what changes when the payment waits for the work.",
    featureColumn: "Feature",
    usColumn: "InfluenceIt",
    othersColumn: "Direct deals",
    manual: "Manual",
    rows: [
      { label: "Payment held until you approve", us: "yes", others: "no" },
      { label: "Fixed prices shown up front", us: "yes", others: "no" },
      { label: "Verified creator profiles", us: "yes", others: "no" },
      { label: "Brief, delivery and revisions in one place", us: "yes", others: "no" },
      { label: "Revision requests built in", us: "yes", others: "manual" },
      { label: "Clear record of every order", us: "yes", others: "manual" },
      { label: "Payment secured before you start", us: "yes", others: "no" },
      { label: "Brands find you, and you can apply to jobs", us: "yes", others: "no" },
    ],
  },

  testimonials: {
    eyebrow: "Brand stories",
    heading: "What brands say after the first order",
    note: "Sample quotes from fictional brands in this prototype.",
    items: {
      northloom: {
        quote:
          "We saw the price, paid into escrow, and approved the reel on the first try. No chasing anyone for invoices.",
        role: "Founder",
      },
      "tamarind-lane": {
        quote:
          "Knowing the money was held until we signed off made our first creator campaign feel safe instead of risky.",
        role: "Head of Growth",
      },
      "kiln-and-co": {
        quote:
          "Verified profiles and fixed packages meant no surprise add-ons. The final bill matched the quote.",
        role: "Owner",
      },
    },
    metricLabels: {
      deliveryDays: "days from order to delivery",
      reviewRounds: "review round to approval",
      surpriseFees: "surprise fees on the final bill",
    },
  },

  faq: {
    eyebrow: "FAQ",
    heading: "Questions, answered",
    subheading: "Short answers about payments, prices and approvals.",
    items: [
      {
        question: "What does \"held in escrow\" mean?",
        answer:
          "When you place an order, your payment goes into a protected hold. The creator can see it is secured, but cannot receive it until you approve the content.",
      },
      {
        question: "When does the creator get paid?",
        answer:
          "Right after you approve the delivered content. If you ask for a revision, the payment stays on hold until the revised content is approved.",
      },
      {
        question: "What if I do not like the content?",
        answer:
          "Request a revision with a short note. The creator updates the content and delivers again. Your payment is not released in the meantime.",
      },
      {
        question: "How are prices set?",
        answer:
          "Creators publish fixed-price packages. You see the price before you order, so there is no negotiation and no surprise add-ons.",
      },
      {
        question: "How are creators verified?",
        answer:
          "Each profile is checked before it gets the Verified badge, so you know the account and the audience numbers belong to a real creator.",
      },
      {
        question: "Is this a live service?",
        answer:
          "No. InfluenceIt is a prototype. Payments, creators, brands and quotes are fictional and nothing here moves real money.",
      },
      {
        question: "Can creators reach out to brands?",
        answer: "Yes. Open jobs let creators reach brands directly. You apply with a short note and one of your packages, and the brand decides who to work with.",
      },
      {
        question: "Do creators pay to join?",
        answer: "Joining is free in this prototype. A platform fee is already included in each package price.",
      },
    ],
  },

  gallery: {
    eyebrow: "Content formats",
    heading: "The kind of content brands order",
    subheading: "Short videos, tutorials and reviews, made by creators who match your niche.",
    listLabel: "Sample content formats, scroll sideways to see more",
    note: "Placeholder visuals. Real creator work will appear here once creators join.",
    tiles: {
      unboxing: { format: "Unboxing", niche: "Tech" },
      tutorial: { format: "Tutorial", niche: "Beauty" },
      tasting: { format: "Taste test", niche: "Food" },
      workout: { format: "Workout", niche: "Fitness" },
      vlog: { format: "Travel vlog", niche: "Travel" },
      roomTour: { format: "Room tour", niche: "Home" },
    },
  },

  jobs: {
    eyebrow: "Open jobs",
    heading: "Brands are looking for you",
    subheading: "Pick a brief that fits your niche and apply in a minute.",
    browseAll: "See all open jobs",
    budgetLabel: "Budget",
    delivery: "{days}-day delivery",
    applicants: "{count} applicants",
    apply: "Apply now",
    filterLabel: "Filter jobs by niche",
    allNiches: "All",
    resultCount: "{count} jobs shown",
    noResults: "No open jobs in this niche right now.",
    note: "Sample jobs from fictional brands.",
    listLabel: "Open jobs from brands",
    formats: {
      reelStories: "1 Reel + 3 Stories",
      tutorial: "Tutorial video",
      review: "Honest review",
      unboxing: "Unboxing video",
      vlog: "Short vlog",
      photoSet: "Photo set",
    },
  },

  pages: {
    creators: {
      title: "Creators | InfluenceIt",
      description: "Search verified creators and compare fixed prices.",
      eyebrow: "Creators",
      heading: "Find the right creator",
      subheading: "Search verified creators and compare fixed prices.",
      searchLabel: "Search creators",
      searchPlaceholder: "Search by name or handle",
      noResults: "No creators match your search.",
      count: "{count} creators",
    },
    jobs: {
      title: "Open jobs | InfluenceIt",
      description: "Open briefs from brands. Apply to the ones that fit your niche.",
      eyebrow: "Open jobs",
      heading: "Open jobs from brands",
      subheading: "Apply to briefs that fit your niche. The brand picks who to work with.",
    },
    howItWorks: {
      title: "How it works | InfluenceIt",
      description: "The same safe flow for brands and creators: escrow, fixed prices and approval.",
      eyebrow: "How it works",
      heading: "How InfluenceIt works",
      subheading: "The same safe flow for brands and creators.",
    },
    login: {
      title: "Log in | InfluenceIt",
      description: "Log in to your brand or creator account.",
      eyebrow: "Welcome back",
      heading: "Log in",
      subheading: "Use the email and password of your account.",
    },
    signup: {
      title: "Sign up | InfluenceIt",
      description: "Join InfluenceIt as a brand or as a creator.",
    },
    industry: "Industry",
    city: "City",
    cityPlaceholder: "Choose a city",
    submitting: "Creating your account...",
    errors: {
      name: "Please enter your first and last name.",
      email: "Please enter a valid email address.",
      password: "Your password needs at least 8 characters.",
      terms: "Please accept the terms to continue.",
      emailTaken: "An account with this email already exists. Try logging in.",
      niche: "Please choose a niche.",
      company: "Please enter your brand name.",
      handle: "Use 2 to 30 letters, numbers, dots or underscores for your handle.",
      city: "Please choose a city.",
      generic: "Something went wrong. Please try again.",
    },
  },

  signup: {
    eyebrow: "Join",
    heading: "Create your account",
    subheading: "Pick your side. It takes a minute.",
    roleLabel: "Account type",
    roleBrand: "Brand",
    roleCreator: "Creator",
    hintBrand: "Find creators and order in minutes.",
    hintCreator: "Get discovered and apply to open jobs.",
    name: "Your name",
    email: "Email",
    company: "Brand name",
    niche: "Main niche",
    nichePlaceholder: "Choose a niche",
    handle: "Social handle",
    handlePlaceholder: "@yourhandle",
    roleBrandText: "Hire creators and pay only when you approve.",
    roleCreatorText: "Create content and get paid by brands.",
    firstName: "First name",
    lastName: "Last name",
    passwordLabel: "Password",
    passwordHint: "At least 8 characters",
    terms: "I have read and accept the Terms of Use and Privacy Policy.",
    termsLinkTerms: "Terms of Use",
    termsLinkPrivacy: "Privacy Policy",
    infoBrand: "After you sign up, you can set up your brand profile and post open jobs.",
    infoCreator: "After you sign up, you can add your social accounts and content categories from your profile.",
    haveAccount: "Already have an account?",
    logIn: "Log in",
    submit: "Create my account",
    note: "Prototype: all accounts and data stay on this computer.",
  },

  login: {
    brandTitle: "Brand account",
    brandText: "Manage your orders, creators and payments.",
    creatorTitle: "Creator account",
    creatorText: "Manage your profile, jobs and payouts.",
    email: "Email",
    password: "Password",
    submit: "Log in",
    noAccount: "No account yet?",
    signUp: "Sign up",
    submitting: "Logging in...",
    errors: { invalid: "Email or password is not correct." },
    demoAccounts: "Demo accounts (password demo1234): mira-solis@example.com is a creator, northloom-coffee@example.com is a brand.",
  },

  account: {
    title: "My account | InfluenceIt",
    eyebrow: "My account",
    welcome: "Welcome, {name}",
    roleBrand: "Brand account",
    roleCreator: "Creator account",
    emailLabel: "Email",
    companyLabel: "Brand",
    industryLabel: "Industry",
    handleLabel: "Handle",
    nicheLabel: "Niche",
    cityLabel: "City",
    jobsLabel: "Open jobs posted",
    ordersLabel: "Orders",
    applicationsLabel: "Applications sent",
    brandNext: "Find a creator and order a package.",
    creatorNext: "Browse open jobs and apply.",
    creatorNoPackages: "Your profile is hidden from the creators list until you add packages. Package editing is coming soon.",
    findCreators: "Browse creators",
    browseJobs: "Browse open jobs",
    viewProfile: "View my public profile",
    logOut: "Log out",
    loading: "Loading your account...",
  },

  notFound: {
    heading: "This page does not exist",
    text: "The address may be mistyped or the page may have moved.",
    home: "Back to home",
    jobs: "Browse open jobs",
  },

  footer: {
    tagline: "Hire creators. Pay only when you approve.",
    navTitle: "Explore",
    contactTitle: "Contact",
    note: "InfluenceIt is a demo prototype. All people, brands and numbers are fictional.",
    backToTop: "Back to top",
  },

  cta: {
    heading: "Ready when you are",
    subheading: "Pick your side. Both start in a minute.",
    brand: {
      title: "For brands",
      description:
        "Find a verified creator, see the price up front, and pay only when you approve the content.",
    },
    creator: {
      title: "For creators",
      description:
        "Set your prices once, receive clear briefs, and get paid when the brand approves.",
    },
    prototypeNote:
      "InfluenceIt is a prototype. All creators, brands and quotes are fictional.",
  },
};

export default en;

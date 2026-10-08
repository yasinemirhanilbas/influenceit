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
    supportEmail: "hello@influenceit.example",
    mainNavLabel: "Main navigation",
    menu: "Menu",
    closeMenu: "Close menu",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Creators", href: "#creators" },
      { label: "Brand stories", href: "#stories" },
      { label: "FAQ", href: "#faq" },
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
    chipVerified: "Verified creator",
    chipPending: "Awaiting payment",
    chipProtected: "{amount} protected",
    chipPaid: "{amount} paid out",
  },

  receipt: {
    title: "Order receipt",
    orderNumber: "Order #{number}",
    packageLabel: "Package",
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
    ],
  },

  testimonials: {
    eyebrow: "Brand stories",
    heading: "What brands say after the first order",
    note: "Sample quotes from fictional brands in this prototype.",
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
    ],
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

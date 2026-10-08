import { creators } from "./creators";

// Fictional order shown on the hero receipt.
export const sampleOrder = {
  number: 1042,
  creator: creators[0],
  packageName: "1 Reel + 3 Stories",
  price: { amount: 4200, currency: "TRY" },
};

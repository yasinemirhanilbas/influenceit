// Helpers for creator data.
export function getTier(followers) {
  if (followers >= 500000) return "macro";
  if (followers >= 50000) return "mid";
  return "micro";
}

export function getNiches(creators) {
  return [...new Set(creators.map((creator) => creator.niche))];
}

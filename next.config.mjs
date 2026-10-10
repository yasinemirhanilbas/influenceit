/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Global 404 page for addresses that match no route (see app/global-not-found.js).
  experimental: {
    globalNotFound: true,
    // Creator photos go through a server action (4 photos x 5 MB, see lib/images.js); default would be 1 MB.
    serverActions: { bodySizeLimit: "25mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

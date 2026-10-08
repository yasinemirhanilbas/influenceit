/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Global 404 page for addresses that match no route (see app/global-not-found.js).
  experimental: {
    globalNotFound: true,
    // Delivery videos go through a server action (limit 50 MB, see lib/storage.js); default would be 1 MB.
    serverActions: { bodySizeLimit: "55mb" },
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Global 404 page for addresses that match no route (see app/global-not-found.js).
  experimental: {
    globalNotFound: true,
    // Creator photos (4 photos x 5 MB, see lib/images.js) and delivery videos (up to 50 MB, see lib/storage.js)
    // go through server actions; the default limit would be 1 MB.
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

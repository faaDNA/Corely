/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/types'],
  // Impor barrel (lucide-react, @repo/ui) di-cetak baris vs satu per-ikon → bundle lebih ramping
  experimental: {
    optimizePackageImports: ['lucide-react', '@repo/ui'],
  },
};

module.exports = nextConfig;
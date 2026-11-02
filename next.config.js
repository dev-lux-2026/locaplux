import withNextIntl from 'next-intl/plugin';

const withIntl = withNextIntl('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 🚀 AUTORISATION SUPABASE : Permet à Next.js d'afficher les photos de profil
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withIntl(nextConfig);

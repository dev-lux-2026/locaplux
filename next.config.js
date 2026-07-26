import withNextIntl from 'next-intl/plugin';

const withIntl = withNextIntl('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withIntl(nextConfig);

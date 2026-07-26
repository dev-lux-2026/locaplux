import withNextIntl from 'next-intl/plugin';

const withIntl = withNextIntl('./src/i18n/request.ts');

export default withIntl({
  reactStrictMode: true
});

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

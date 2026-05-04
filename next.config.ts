import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typedRoutes: true,
  allowedDevOrigins: ['172.16.0.1', '192.168.1.105'],
  devIndicators: {
    position: 'bottom-right',
  },
}

const withNextIntl = createNextIntlPlugin({
  experimental: {
    // Provide the path to the messages that you're using in `AppConfig`
    createMessagesDeclaration: './messages/en.json',
    messages: {
      path: './messages',
      locales: 'infer',
      format: 'json',
      precompile: true,
    },
  },
})

export default withNextIntl(nextConfig)

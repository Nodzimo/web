import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
	allowedDevOrigins: ['172.16.0.1', '172.18.0.1', '192.168.1.105'],
	devIndicators: {
		position: 'bottom-right',
	},
	reactCompiler: true,
	typedRoutes: true,
}

const withNextIntl = createNextIntlPlugin({
	experimental: {
		// Provide the path to the messages that you're using in `AppConfig`
		createMessagesDeclaration: './messages/en.json',
		messages: {
			format: 'json',
			locales: 'infer',
			path: './messages',
			precompile: true,
		},
	},
})

export default withNextIntl(nextConfig)

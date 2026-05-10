import type { MetadataRoute } from 'next'
import type { Locale } from 'next-intl'
import { getPathname, routing } from '@/i18n'

const host = 'https://nodzimo.com'

type Href = keyof typeof routing.pathnames

type SitemapEntry = MetadataRoute.Sitemap[number]

type SitemapRoute = {
	href: Href
} & Pick<SitemapEntry, 'changeFrequency' | 'priority'>

const sitemapRoutes: readonly SitemapRoute[] = [
	{
		href: '/',
		changeFrequency: 'daily',
		priority: 1,
	},
	{
		href: '/test',
		changeFrequency: 'weekly',
		priority: 0.1,
	},
]

function getUrl(locale: Locale, href: Href) {
	return host + getPathname({ locale, href })
}

type LanguageAlternates = Record<Locale, string>

function getLanguageAlternates(href: Href): LanguageAlternates {
	return Object.fromEntries(
		routing.locales.map((locale: Locale): [Locale, string] => {
			return [locale, getUrl(locale, href)]
		}),
	) as LanguageAlternates
}

export default function sitemap(): MetadataRoute.Sitemap {
	return sitemapRoutes.map(
		({ href, changeFrequency, priority }): SitemapEntry => {
			return {
				url: getUrl(routing.defaultLocale, href),
				lastModified: new Date(),
				changeFrequency,
				priority,
				alternates: {
					languages: getLanguageAlternates(href),
				},
			}
		},
	)
}

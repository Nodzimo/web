import type { Metadata } from 'next'
import { getMessages } from 'next-intl/server'
import { fontVariables } from '@/app/_lib'
import { routing, setStaticLocaleFromParams } from '@/i18n'
import { Footer, Header, Main, Providers } from './_components'
import { getMetadataTranslations } from './_lib'

export async function generateMetadata({
	params,
}: LayoutProps<'/[locale]'>): Promise<Metadata> {
	const { locale, t } = await getMetadataTranslations(params, 'Metadata')
	const title = t('title')

	return {
		title: {
			default: title,
			template: `%s | ${title} | ${locale.toUpperCase()}`,
		},
		description: t('description'),
	}
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
	children,
	params,
}: LayoutProps<'/[locale]'>) {
	const locale = await setStaticLocaleFromParams(params)
	const { ErrorPage } = await getMessages({ locale })
	const clientMessages = { ErrorPage }
	const { region } = new Intl.Locale(locale)
	console.debug(`[SN] Locale: ${locale}, Region: ${region}`)

	return (
		<html
			className={`${fontVariables} h-full bg-fuchsia-500 antialiased`}
			dir={locale === 'ar' ? 'rtl' : 'ltr'}
			lang={locale}
		>
			<body className={'flex min-h-full flex-col bg-lime-500'}>
				<Providers messages={clientMessages}>
					<Header />
					<Main>{children}</Main>
					<Footer />
				</Providers>
			</body>
		</html>
	)
}

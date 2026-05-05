import type { Metadata } from 'next'
import '../globals.css'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import {
  getLocaleFromParams,
  setStaticLocaleFromParams,
} from '@/i18n/static-locale'
import { Footer, Header, Main, Providers } from './_components'
import { fontVariables } from './_lib'

export async function generateMetadata({
  params,
}: Omit<LayoutProps<'/[locale]'>, 'children'>): Promise<Metadata> {
  const locale = await getLocaleFromParams(params)
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const locale = await setStaticLocaleFromParams(params)

  return (
    <html
      lang={locale}
      className={`${fontVariables} h-full bg-fuchsia-500 antialiased`}
    >
      <body className={'flex min-h-full flex-col bg-lime-500'}>
        <Providers>
          <Header />
          <Main>{children}</Main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

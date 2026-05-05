import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import '../globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import LocaleSwitcher from '@/components/locale-switcher'
import { routing } from '@/i18n/routing'
import {
  getLocaleFromParams,
  setStaticLocaleFromParams,
} from '@/i18n/static-locale'

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--app-font-sans',
  subsets: ['latin', 'cyrillic'],
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--app-font-mono',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
})

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
  const t = await getTranslations('LocaleLayout')

  return (
    <html
      lang={locale}
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full bg-fuchsia-500 antialiased`}
    >
      <body className={'flex min-h-full flex-col bg-lime-500'}>
        <NextIntlClientProvider messages={null}>
          <header
            className={
              'sticky top-0 flex flex-wrap items-center justify-between gap-2 bg-sky-100 p-2'
            }
          >
            {t('header')}
            <LocaleSwitcher />
          </header>
          <main
            className={'flex grow items-center justify-center bg-amber-100 p-2'}
          >
            {children}
          </main>
          <footer className={'bg-emerald-100 p-2 text-center'}>
            {t('footer')}
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

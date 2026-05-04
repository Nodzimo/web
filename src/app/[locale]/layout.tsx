import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import '../globals.css'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'
import LocaleSwitcher from '@/components/locale-switcher'
import { routing } from '@/i18n/routing'

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--app-font-sans',
  subsets: ['latin', 'cyrillic'],
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--app-font-mono',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
})

type Params = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

type Props = {
  children: ReactNode
} & Params

export default async function LocaleLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params
  const t = await getTranslations('LocaleLayout')

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html
      lang={locale}
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full bg-fuchsia-500 antialiased`}
    >
      <body className={'flex min-h-full flex-col bg-lime-500'}>
        <NextIntlClientProvider>
          <header
            className={
              'flex flex-wrap items-center justify-between gap-2 bg-sky-100 p-2'
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

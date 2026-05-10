import { notFound } from 'next/navigation'
import { hasLocale, type Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'
import { routing } from './routing'

type LocaleParams = Promise<{ locale: string }>

function assertLocale(locale: string): asserts locale is Locale {
	if (!hasLocale(routing.locales, locale)) {
		notFound()
	}
}

export function useStaticLocale(params: LocaleParams): Locale {
	const { locale } = use(params)

	assertLocale(locale)

	setRequestLocale(locale)

	return locale
}

export async function getLocaleFromParams(
	params: LocaleParams,
): Promise<Locale> {
	const { locale } = await params

	assertLocale(locale)

	return locale
}

export async function setStaticLocaleFromParams(
	params: LocaleParams,
): Promise<Locale> {
	const locale = await getLocaleFromParams(params)

	setRequestLocale(locale)

	return locale
}

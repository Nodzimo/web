import type { Messages, NamespaceKeys, NestedKeyOf } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { getLocaleFromParams } from '@/i18n'

type LocaleParams = { locale: string }

type IntlNamespace = NamespaceKeys<Messages, NestedKeyOf<Messages>>

export async function getMetadataTranslations<
	Params extends LocaleParams,
	Namespace extends IntlNamespace,
>(params: Promise<Params>, namespace: Namespace) {
	const [locale, resolvedParams] = await Promise.all([
		getLocaleFromParams(params),
		params,
	])

	const t = await getTranslations({ locale, namespace })

	return { locale, params: resolvedParams, t }
}

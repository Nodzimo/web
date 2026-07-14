import type { SelectOptions } from '@nodzimo/ui/client'
import { type Locale, useLocale, useTranslations } from 'next-intl'
import { routing } from '@/i18n'
import { LocaleSwitcherSelect } from './locale-switcher-select'

export function LocaleSwitcher() {
	const t = useTranslations('LocaleSwitcher')
	const locale = useLocale()

	const localeOptions: SelectOptions<Locale> = routing.locales.map((locale) => {
		return {
			label: t('locale', { locale }),
			value: locale,
		}
	})

	return (
		<LocaleSwitcherSelect
			items={localeOptions}
			label={t('label')}
			locale={locale}
		/>
	)
}

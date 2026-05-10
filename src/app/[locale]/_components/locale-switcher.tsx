import { useLocale, useTranslations } from 'next-intl'
import { routing } from '@/i18n'
import { LocaleSwitcherSelect } from './locale-switcher-select'

export function LocaleSwitcher() {
	const t = useTranslations('LocaleSwitcher')
	const locale = useLocale()

	return (
		<LocaleSwitcherSelect defaultValue={locale} label={t('label')}>
			{routing.locales.map(locale => (
				<option key={locale} value={locale}>
					{t('locale', { locale })}
				</option>
			))}
		</LocaleSwitcherSelect>
	)
}

import {
	ArabLeagueFlagIcon,
	BelarusFlagIcon,
	ChinaFlagIcon,
	FranceFlagIcon,
	GermanyFlagIcon,
	ItalyFlagIcon,
	JapanFlagIcon,
	RussiaFlagIcon,
	SpainFlagIcon,
	UkraineFlagIcon,
	UnitedStatesFlagIcon,
} from '@nodzimo/ui'
import { useLocale, useTranslations } from 'next-intl'
import {
	type LocaleSwitcherGroup,
	LocaleSwitcherSelect,
} from './locale-switcher-select'

export function LocaleSwitcher() {
	const t = useTranslations('LocaleSwitcher')
	const locale = useLocale()

	const localeGroups = [
		{
			items: [
				{
					icon: <UnitedStatesFlagIcon />,
					label: t('locale', { locale: 'en' }),
					value: 'en',
				},
				{
					icon: <GermanyFlagIcon />,
					label: t('locale', { locale: 'de' }),
					value: 'de',
				},
				{
					icon: <FranceFlagIcon />,
					label: t('locale', { locale: 'fr' }),
					value: 'fr',
				},
				{
					icon: <ItalyFlagIcon />,
					label: t('locale', { locale: 'it' }),
					value: 'it',
				},
				{
					icon: <SpainFlagIcon />,
					label: t('locale', { locale: 'es' }),
					value: 'es',
				},
			],
			label: t('groups.westernEuropean'),
		},
		{
			items: [
				{
					icon: <RussiaFlagIcon />,
					label: t('locale', { locale: 'ru' }),
					value: 'ru',
				},
				{
					icon: <BelarusFlagIcon />,
					label: t('locale', { locale: 'be' }),
					value: 'be',
				},
				{
					icon: <UkraineFlagIcon />,
					label: t('locale', { locale: 'uk' }),
					value: 'uk',
				},
			],
			label: t('groups.eastSlavic'),
		},
		{
			items: [
				{
					icon: <ArabLeagueFlagIcon />,
					label: t('locale', { locale: 'ar' }),
					value: 'ar',
				},
			],
			label: t('groups.middleEastern'),
		},
		{
			items: [
				{
					icon: <ChinaFlagIcon />,
					label: t('locale', { locale: 'zh' }),
					value: 'zh',
				},
				{
					icon: <JapanFlagIcon />,
					label: t('locale', { locale: 'ja' }),
					value: 'ja',
				},
			],
			label: t('groups.eastAsian'),
		},
	] satisfies readonly LocaleSwitcherGroup[]

	return (
		<LocaleSwitcherSelect
			groups={localeGroups}
			label={t('label')}
			locale={locale}
		/>
	)
}

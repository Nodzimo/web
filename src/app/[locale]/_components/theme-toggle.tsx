import { MonitorIcon, MoonIcon, SunIcon } from '@nodzimo/ui'
import { useTranslations } from 'next-intl'
import { type ThemeToggleItem, ThemeToggleMenu } from './theme-toggle-menu'

export function ThemeToggle() {
	const t = useTranslations('ThemeToggle')

	const themeItems: ThemeToggleItem[] = [
		{
			icon: <MonitorIcon />,
			label: t('system'),
			value: 'system',
		},
		{
			icon: <SunIcon />,
			label: t('light'),
			value: 'light',
		},
		{
			icon: <MoonIcon />,
			label: t('dark'),
			value: 'dark',
		},
	]

	return <ThemeToggleMenu items={themeItems} label={t('label')} />
}

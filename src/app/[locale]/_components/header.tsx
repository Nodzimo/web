import { useTranslations } from 'next-intl'
import { LocaleSwitcher } from './locale-switcher'
import { ThemeToggle } from './theme-toggle'

export function Header() {
	const t = useTranslations('Header')

	return (
		<header
			className={
				'sticky top-0 flex flex-wrap items-center justify-between gap-2 bg-sky-100 p-2'
			}
		>
			{t('header')}
			<LocaleSwitcher />
			<ThemeToggle />
		</header>
	)
}

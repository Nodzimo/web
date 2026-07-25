import { useTranslations } from 'next-intl'
import { LocaleSwitcher } from './locale-switcher'
import { ThemeToggle } from './theme-toggle'

export function Header() {
	const t = useTranslations('Header')

	return (
		<header
			className={
				'sticky top-0 flex items-center justify-between gap-2 bg-nui-card p-2'
			}
		>
			{t('header')}
			<div className={'flex gap-2'}>
				<LocaleSwitcher />
				<ThemeToggle />
			</div>
		</header>
	)
}

import { useTranslations } from 'next-intl'

export function Footer() {
	const t = useTranslations('Footer')

	return (
		<footer className={'bg-nui-card p-2 text-center'}>{t('footer')}</footer>
	)
}

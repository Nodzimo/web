import { useTranslations } from 'next-intl'

export function Footer() {
	const t = useTranslations('Footer')

	return (
		<footer className={'bg-emerald-100 p-2 text-center'}>{t('footer')}</footer>
	)
}

import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { Link, useStaticLocale } from '@/i18n'
import { getMetadataTranslations } from '../_lib/metadata'
import { ThrowErrorButton } from './_components'

export async function generateMetadata({
	params,
}: PageProps<'/[locale]/test'>): Promise<Metadata> {
	const { t } = await getMetadataTranslations(params, 'TestPage')

	return {
		title: t('title'),
	}
}

export default function TestPage({ params }: PageProps<'/[locale]/test'>) {
	useStaticLocale(params)
	const t = useTranslations('TestPage')

	return (
		<div className={'flex flex-col gap-10'}>
			<Link href={'/'}>{t('indexPageLink')}</Link>
			<ThrowErrorButton
				label={t('throwErrorButton')}
				errorMessage={t('testError')}
			/>
			<a href={'/sitemap.xml'}>Sitemap.xml</a>
			<a href={'/robots.txt'}>Robots.txt</a>
			<p>{t('pangram')}</p>
			<p>{t('alphabetUppercase')}</p>
			<p>{t('alphabetLowercase')}</p>
			<p>0 1 2 3 4 5 6 7 8 9</p>
			<p>ilI1L g oO0Q СФ</p>
			<p>
				:D :-) ^^ : ) TT :) :o :O :0 :P xD :| :/ :\ :3 {'>'}:E o_O 0_0 ))) {'<'}
				3 .!. :'(
			</p>
			<p>₿ ₽ ₹ $ ¢ € £ ¥ ¤</p>
			<p>ƒ ☭ © ® ™ ´ · ˆ ˚ ˜</p>
			<p>⌀ ∞ √ ° % ¹ ² ³ ¼ ½ ¾ + - = ≠ × ÷ ±</p>
			<p>{'< > { }'}</p>
			<p>~ / @ [ \ ] | ^ ¦ _ `</p>
			<p>§ • … ? ... ! " # № & ' ( ) * . , : ;</p>
			<p>‐ ‑ ‒ – —</p>
			<p>‹ › « » ‘ ’ ‚ “ ” „</p>
			<p>← → ↑ ↓ ▲ ▼ ↻ ↺</p>
			<p>✓ ✔ 🗸 ✖ ✗ ✘ ☒</p>
		</div>
	)
}

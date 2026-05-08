import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useStaticLocale } from '@/i18n/static-locale'
import { ThrowErrorButton } from './_components'

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

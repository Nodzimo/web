import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
  const t = useTranslations('NotFound')

  return (
    <div>
      <h2>{t('title')}</h2>
      <p>{t('description')}</p>
      <p>
        <Link href={'/'}>{t('returnHomeLink')}</Link>
      </p>
    </div>
  )
}

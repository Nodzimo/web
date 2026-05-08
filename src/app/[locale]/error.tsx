'use client' // Error boundaries must be Client Components

import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

interface RetryHandler {
  // biome-ignore lint/style/useShorthandFunctionType: Avoids false positive from Next client-boundary check.
  (): void
}

type Props = {
  error: Error & { digest?: string }
  unstable_retry: RetryHandler
}

export default function ErrorPage({ error, unstable_retry }: Props) {
  const t = useTranslations('ErrorPage')

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>{t('somethingWentWrong')}</h2>
      {error.digest && (
        <p>
          {t('errorDigest')}
          {error.digest}
        </p>
      )}
      {error.message && (
        <details>
          <summary>{t('errorMessage')}</summary>
          <p className={'wrap-anywhere font-mono'}>{error.message}</p>
        </details>
      )}
      {error.stack && (
        <details>
          <summary>{t('errorStack')}</summary>
          <p className={'wrap-anywhere font-mono'}>{error.stack}</p>
        </details>
      )}
      <button
        type={'button'}
        onClick={
          // Attempt to recover by re-fetching and re-rendering the segment
          () => unstable_retry()
        }
      >
        {t('tryAgain')}
      </button>
    </div>
  )
}

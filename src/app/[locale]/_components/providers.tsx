import { NextIntlClientProvider } from 'next-intl'
import type { PropsWithChildren } from 'react'

export function Providers({ children }: PropsWithChildren) {
  return (
    <NextIntlClientProvider messages={null}>{children}</NextIntlClientProvider>
  )
}

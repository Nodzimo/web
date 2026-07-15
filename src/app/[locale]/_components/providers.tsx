import { ThemeProvider } from '@wrksz/themes/next'
import { type Messages, NextIntlClientProvider } from 'next-intl'
import type { PropsWithChildren } from 'react'

type Props = PropsWithChildren & {
	messages: Pick<Messages, 'ErrorPage'>
}

export function Providers({ children, messages }: Props) {
	return (
		<ThemeProvider>
			<NextIntlClientProvider messages={messages}>
				{children}
			</NextIntlClientProvider>
		</ThemeProvider>
	)
}

import type { PropsWithChildren } from 'react'

export function Main({ children }: PropsWithChildren) {
	return (
		<main className={'flex grow items-center justify-center p-2'}>
			{children}
		</main>
	)
}

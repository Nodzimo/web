import type { PropsWithChildren } from 'react'

export function Main({ children }: PropsWithChildren) {
  return (
    <main className={'flex grow items-center justify-center bg-amber-100 p-2'}>
      {children}
    </main>
  )
}

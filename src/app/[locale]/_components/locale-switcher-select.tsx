'use client'

import clsx from 'clsx'
import { useParams } from 'next/navigation'
import type { Locale } from 'next-intl'
import { type ChangeEvent, type ReactNode, useTransition } from 'react'
import { usePathname, useRouter } from '@/i18n'

type Props = {
	children: ReactNode
	defaultValue: string
	label: string
}

export function LocaleSwitcherSelect({ children, defaultValue, label }: Props) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const pathname = usePathname()
	const params = useParams()

	function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
		const nextLocale = event.target.value as Locale

		startTransition(() => {
			router.replace(
				// @ts-expect-error -- TypeScript will validate that only known `params`
				// are used in combination with a given `pathname`. Since the two will
				// always match for the current route, we can skip runtime checks.
				{ pathname, params },
				{ locale: nextLocale },
			)
		})
	}

	return (
		<label
			className={clsx(
				'cursor-pointer rounded bg-lime-100 p-2',
				isPending && 'transition-opacity disabled:opacity-30',
			)}
		>
			<span className={'sr-only'}>{label}</span>
			<select
				className={'cursor-pointer'}
				defaultValue={defaultValue}
				disabled={isPending}
				onChange={onSelectChange}
			>
				{children}
			</select>
		</label>
	)
}

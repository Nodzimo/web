'use client'

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	type SelectOptions,
	SelectTrigger,
	SelectValue,
} from '@nodzimo/ui/client'
import { useParams } from 'next/navigation'
import type { Locale } from 'next-intl'
import { useTransition } from 'react'
import { usePathname, useRouter } from '@/i18n'

type Props = {
	locale: Locale
	label: string
	items: SelectOptions<Locale>
}

export function LocaleSwitcherSelect({ locale, items, label }: Props) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const pathname = usePathname()
	const params = useParams()

	function onLocaleChange(nextLocale: Locale | null) {
		if (nextLocale === null || nextLocale === locale) {
			return
		}

		startTransition(() => {
			router.replace(
				// @ts-expect-error -- TypeScript will validate that only known `params`
				// are used in combination with a given `pathname`. Since the two will
				// always match for the current route, we can skip runtime checks.
				{ params, pathname },
				{ locale: nextLocale },
			)
		})
	}

	return (
		<Select
			disabled={isPending}
			items={items}
			onValueChange={onLocaleChange}
			value={locale}
		>
			<SelectTrigger aria-label={label} className={'w-40 transition-opacity'}>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{items.map(({ value, label: itemLabel }) => {
						return (
							<SelectItem key={value} value={value}>
								{itemLabel}
							</SelectItem>
						)
					})}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}

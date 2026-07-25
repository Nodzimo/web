'use client'

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	type SelectOption,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@nodzimo/ui/client'
import { useParams } from 'next/navigation'
import type { Locale } from 'next-intl'
import { Fragment, type ReactElement, useTransition } from 'react'
import { usePathname, useRouter } from '@/i18n'

type LocaleSwitcherOption = SelectOption<Locale> & {
	icon: ReactElement
}

export type LocaleSwitcherGroup = {
	items: readonly LocaleSwitcherOption[]
	label: string
}

type Props = {
	groups: readonly LocaleSwitcherGroup[]
	label: string
	locale: Locale
}

export function LocaleSwitcherSelect({ groups, label, locale }: Props) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const pathname = usePathname()
	const params = useParams()
	const items = groups.flatMap(({ items: groupItems }) => groupItems)

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
				<SelectValue>
					{(value: Locale) => {
						const selectedOption = items.find((option) => {
							return option.value === value
						})

						if (!selectedOption) {
							return null
						}

						return (
							<span className={'flex items-center gap-2'}>
								{selectedOption.icon}
								{selectedOption.label}
							</span>
						)
					}}
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{groups.map((group, groupIndex) => {
					return (
						<Fragment key={group.label}>
							{groupIndex > 0 && <SelectSeparator />}
							<SelectGroup>
								<SelectLabel>{group.label}</SelectLabel>
								{group.items.map((option) => {
									return (
										<SelectItem
											className={'*:items-center'}
											key={option.value}
											value={option.value}
										>
											{option.icon}
											{option.label}
										</SelectItem>
									)
								})}
							</SelectGroup>
						</Fragment>
					)
				})}
			</SelectContent>
		</Select>
	)
}

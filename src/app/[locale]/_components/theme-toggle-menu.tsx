'use client'

import { MoonIcon, SunIcon } from '@nodzimo/ui'
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@nodzimo/ui/client'
import { type ThemeSelection, useTheme } from '@wrksz/themes/client'
import type { ReactElement } from 'react'

export type ThemeToggleItem = {
	icon: ReactElement
	label: string
	value: ThemeSelection
}

type Props = {
	items: ThemeToggleItem[]
	label: string
}

export function ThemeToggleMenu({ items, label }: Props) {
	const { theme, setTheme } = useTheme()

	function onThemeSelectionChange(themeSelection: ThemeSelection) {
		setTheme(themeSelection)
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={<Button size={'icon'} variant={'outline'} />}
			>
				<SunIcon
					className={
						'rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0'
					}
				/>
				<MoonIcon
					className={
						'absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100'
					}
				/>
				<span className={'sr-only'}>{label}</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align={'end'} className={'w-auto'}>
				<DropdownMenuRadioGroup
					onValueChange={onThemeSelectionChange}
					value={theme}
				>
					{items.map(({ icon, label: itemLabel, value }) => {
						return (
							<DropdownMenuRadioItem key={value} value={value}>
								{icon}
								{itemLabel}
							</DropdownMenuRadioItem>
						)
					})}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

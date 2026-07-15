'use client'

import { Button } from '@nodzimo/ui/client'
import { useTheme } from '@wrksz/themes/client'

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme()

	function onThemeChange() {
		setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
	}

	return <Button onClick={onThemeChange}>Toggle theme</Button>
}

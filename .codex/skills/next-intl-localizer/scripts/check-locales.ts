import { readdirSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'

type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue }

type FlatMessages = Map<string, string>

const messagesDir = join(process.cwd(), 'messages')
const sourceLocale = 'en'
const localeFiles = readdirSync(messagesDir)
	.filter(file => file.endsWith('.json'))
	.sort()

function readJson(file: string): JsonValue {
	return JSON.parse(readFileSync(join(messagesDir, file), 'utf8')) as JsonValue
}

function flatten(
	value: JsonValue,
	prefix = '',
	result: FlatMessages = new Map(),
) {
	if (typeof value === 'string') {
		result.set(prefix, value)
		return result
	}

	if (Array.isArray(value)) {
		for (const [index, item] of value.entries()) {
			flatten(item, `${prefix}[${index}]`, result)
		}

		return result
	}

	if (value && typeof value === 'object') {
		for (const [key, nestedValue] of Object.entries(value)) {
			flatten(nestedValue, prefix ? `${prefix}.${key}` : key, result)
		}
	}

	return result
}

function extractIcuTokens(message: string) {
	const tokens = new Set<string>()
	let depth = 0

	for (let index = 0; index < message.length; index += 1) {
		const char = message[index]

		if (char === '{') {
			if (depth === 0) {
				const rest = message.slice(index + 1)
				const match = rest.match(/^([\w.-]+)(?:\s*,)?/)

				if (match) {
					tokens.add(match[1])
				}
			}

			depth += 1
			continue
		}

		if (char === '}') {
			depth = Math.max(0, depth - 1)
		}
	}

	return [...tokens].sort()
}

function formatList(items: string[]) {
	return items.length === 0 ? 'none' : items.join(', ')
}

const sourceFile = `${sourceLocale}.json`

if (!localeFiles.includes(sourceFile)) {
	console.error(`Missing source locale file: messages/${sourceFile}`)
	process.exit(1)
}

const source = flatten(readJson(sourceFile))
let hasErrors = false

for (const file of localeFiles) {
	if (file === sourceFile) {
		continue
	}

	const locale = basename(file, '.json')
	const target = flatten(readJson(file))
	const missing = [...source.keys()].filter(key => !target.has(key))
	const extra = [...target.keys()].filter(key => !source.has(key))
	const placeholderMismatches: string[] = []

	for (const [key, sourceMessage] of source) {
		const targetMessage = target.get(key)

		if (targetMessage === undefined) {
			continue
		}

		const sourceTokens = extractIcuTokens(sourceMessage)
		const targetTokens = extractIcuTokens(targetMessage)

		if (sourceTokens.join('\n') !== targetTokens.join('\n')) {
			placeholderMismatches.push(
				`${key} (source: ${formatList(sourceTokens)}; target: ${formatList(targetTokens)})`,
			)
		}
	}

	if (
		missing.length > 0 ||
		extra.length > 0 ||
		placeholderMismatches.length > 0
	) {
		hasErrors = true
		console.error(`\n${locale}:`)

		if (missing.length > 0) {
			console.error(`  Missing keys: ${missing.join(', ')}`)
		}

		if (extra.length > 0) {
			console.error(`  Extra keys: ${extra.join(', ')}`)
		}

		if (placeholderMismatches.length > 0) {
			console.error(`  ICU placeholder mismatches:`)
			for (const mismatch of placeholderMismatches) {
				console.error(`    - ${mismatch}`)
			}
		}
	}
}

if (hasErrors) {
	process.exit(1)
}

console.log(
	`Checked ${localeFiles.length} locale file(s). Locale keys and ICU placeholders match ${sourceFile}.`,
)

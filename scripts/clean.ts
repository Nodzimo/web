import { spawnSync } from 'node:child_process'
import { lstat, mkdir, readdir, rename, rm } from 'node:fs/promises'
import { basename, dirname, isAbsolute, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const cleanTargets = {
	next: {
		label: 'Next.js generated artifacts',
		paths: ['.next', 'next-env.d.ts', '*.tsbuildinfo', 'messages/*.d.json.ts'],
	},
	modules: {
		label: 'installed dependencies',
		paths: ['node_modules'],
	},
} as const

type CleanTarget = keyof typeof cleanTargets

function isCleanTarget(value: string): value is CleanTarget {
	return Object.hasOwn(cleanTargets, value)
}

function assertInsideProject(path: string) {
	const relativePath = relative(projectRoot, path)

	if (
		relativePath === '' ||
		relativePath.startsWith('..') ||
		isAbsolute(relativePath)
	) {
		throw new Error(`Refusing to remove path outside project: ${path}`)
	}
}

async function pathExists(path: string) {
	try {
		await lstat(path)
		return true
	} catch (error) {
		if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
			return false
		}

		throw error
	}
}

async function collectMatchingPaths(pattern: string) {
	if (!pattern.includes('*')) {
		return [resolve(projectRoot, pattern)]
	}

	if (pattern === '*.tsbuildinfo') {
		const entries = await readdir(projectRoot, { withFileTypes: true })

		return entries
			.filter(entry => entry.isFile() && entry.name.endsWith('.tsbuildinfo'))
			.map(entry => resolve(projectRoot, entry.name))
	}

	if (pattern === 'messages/*.d.json.ts') {
		const messagesPath = resolve(projectRoot, 'messages')

		if (!(await pathExists(messagesPath))) {
			return []
		}

		const entries = await readdir(messagesPath, { withFileTypes: true })

		return entries
			.filter(entry => entry.isFile() && entry.name.endsWith('.d.json.ts'))
			.map(entry => resolve(messagesPath, entry.name))
	}

	throw new Error(
		`Unsupported clean pattern: ${pattern}. Add an explicit resolver before using it.`,
	)
}

async function removeTarget(path: string) {
	if (process.platform === 'win32') {
		removeTargetWithPowerShell(path)
		return
	}

	const trashRoot = resolve(projectRoot, '.clean-trash')
	const trashPath = resolve(
		trashRoot,
		`${basename(path)}-${Date.now()}-${process.pid}`,
	)

	assertInsideProject(trashRoot)
	assertInsideProject(trashPath)

	try {
		await mkdir(trashRoot, { recursive: true })
		await rename(path, trashPath)
	} catch (error) {
		if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
			return
		}

		await rm(path, {
			force: true,
			maxRetries: 10,
			recursive: true,
			retryDelay: 300,
		})
		return
	}

	await rm(trashPath, {
		force: true,
		maxRetries: 10,
		recursive: true,
		retryDelay: 300,
	})
}

function removeTargetWithPowerShell(path: string) {
	const result = runPowerShell(
		'Remove-Item -LiteralPath $env:CLEAN_TARGET -Recurse -Force',
		{ CLEAN_TARGET: path },
	)

	if (result.status === 0) {
		return
	}

	const details = [result.stderr.trim(), result.stdout.trim()]
		.filter(Boolean)
		.join('\n')

	throw new Error(
		details ||
			`PowerShell failed to remove ${path} with status ${result.status}`,
	)
}

const requestedTargets = process.argv.slice(2)

if (requestedTargets.length === 0) {
	console.error(
		`Usage: bun scripts/clean.ts <${Object.keys(cleanTargets).join('|')}> [...]`,
	)
	process.exit(1)
}

for (const targetName of requestedTargets) {
	if (!isCleanTarget(targetName)) {
		console.error(`Unknown clean target: ${targetName}`)
		console.error(`Available targets: ${Object.keys(cleanTargets).join(', ')}`)
		process.exit(1)
	}

	const target = cleanTargets[targetName]
	const targetPaths = (
		await Promise.all(target.paths.map(path => collectMatchingPaths(path)))
	).flat()

	for (const targetPath of targetPaths) {
		assertInsideProject(targetPath)

		if (!(await pathExists(targetPath))) {
			console.log(`Skipped ${relative(projectRoot, targetPath)}: not found`)
			continue
		}

		if (process.platform === 'win32') {
			releaseWindowsProjectLocks(targetPath)
		}

		await removeTarget(targetPath)
		console.log(`Removed ${target.label}: ${relative(projectRoot, targetPath)}`)
	}
}

function releaseWindowsProjectLocks(path: string) {
	const result = runPowerShell(
		[
			'$target = $env:CLEAN_TARGET',
			'$project = $env:CLEAN_PROJECT',
			'$self = [int]$env:CLEAN_SELF_PID',
			'$toolNames = @("bun.exe", "node.exe", "biome.exe")',
			'$ids = New-Object "System.Collections.Generic.HashSet[int]"',
			'Get-Process | ForEach-Object {',
			'  $process = $_',
			'  if ($process.Id -ne $self) {',
			'    try {',
			'      foreach ($module in $process.Modules) {',
			'        if ($module.FileName -like "$target*") {',
			'          [void]$ids.Add($process.Id)',
			'          break',
			'        }',
			'      }',
			'    } catch {}',
			'  }',
			'}',
			'Get-CimInstance Win32_Process | ForEach-Object {',
			'  if (',
			'    $_.ProcessId -ne $self -and',
			'    $toolNames -contains $_.Name -and',
			'    $_.CommandLine -and',
			'    $_.CommandLine.Contains($project)',
			'  ) {',
			'    [void]$ids.Add([int]$_.ProcessId)',
			'  }',
			'}',
			'$ids | ForEach-Object {',
			'  try { Stop-Process -Id $_ -Force -ErrorAction Stop } catch {}',
			'}',
			'Start-Sleep -Milliseconds 300',
		].join('\n'),
		{
			CLEAN_PROJECT: projectRoot,
			CLEAN_SELF_PID: String(process.pid),
			CLEAN_TARGET: path,
		},
	)

	if (result.status === 0) {
		return
	}

	const details = [result.stderr.trim(), result.stdout.trim()]
		.filter(Boolean)
		.join('\n')

	throw new Error(
		details ||
			`PowerShell failed to release locks for ${path} with status ${result.status}`,
	)
}

function runPowerShell(command: string, env: Record<string, string>) {
	return spawnSync(
		'powershell.exe',
		[
			'-NoProfile',
			'-NonInteractive',
			'-ExecutionPolicy',
			'Bypass',
			'-Command',
			command,
		],
		{
			encoding: 'utf8',
			env: { ...process.env, ...env },
			stdio: 'pipe',
		},
	)
}

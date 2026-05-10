'use client' // Error boundaries must be Client Components

import { fontVariables } from './_lib'

interface RetryHandler {
	// biome-ignore lint/style/useShorthandFunctionType: Avoids false positive from Next client-boundary check.
	(): void
}

type Props = {
	error: Error & { digest?: string }
	unstable_retry: RetryHandler
}

export default function GlobalError({ error, unstable_retry }: Props) {
	return (
		// global-error must include html and body tags
		<html className={`${fontVariables} h-full`} lang={'en'}>
			<head>
				<title>Error | Nodzimo</title>
			</head>
			<body
				className={
					'flex min-h-full flex-col items-center justify-center bg-red-500'
				}
			>
				<h1 className={'font-bold font-mono text-6xl'}>ERROR</h1>
				<main className={'flex flex-col gap-2 text-white'}>
					<h2>Something went wrong!</h2>
					<button
						className={'rounded bg-white py-1 text-black'}
						onClick={() => unstable_retry()}
						type={'button'}
					>
						Try again
					</button>
					{error.digest && <p>Error code: {error.digest}</p>}
					{error.message && (
						<details>
							<summary>Error message</summary>
							<p className={'wrap-anywhere font-mono'}>{error.message}</p>
						</details>
					)}
					{error.stack && (
						<details>
							<summary>Error stack</summary>
							<p className={'wrap-anywhere font-mono'}>{error.stack}</p>
						</details>
					)}
				</main>
			</body>
		</html>
	)
}

import { fontVariables } from './_lib'

export default function NotFound() {
	return (
		<html className={`${fontVariables} h-full`} lang={'en'}>
			<head>
				<title>404 | Nodzimo</title>
			</head>
			<body
				className={
					'flex min-h-full flex-col items-center justify-center bg-red-500 font-bold'
				}
			>
				<h1 className={'font-mono text-9xl'}>404</h1>
				<a
					className={'text-4xl text-white decoration-white underline-offset-8'}
					href={'/'}
				>
					Nodzimo.com
				</a>
			</body>
		</html>
	)
}

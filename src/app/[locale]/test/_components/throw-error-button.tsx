'use client'

import { useState } from 'react'

type Props = {
  label: string
  errorMessage: string
}

export function ThrowErrorButton({ label, errorMessage }: Props) {
  const [shouldThrowError, setShouldThrowError] = useState(false)

  if (shouldThrowError) {
    throw Error(errorMessage)
  }

  return (
    <button type={'button'} onClick={() => setShouldThrowError(true)}>
      {label}
    </button>
  )
}

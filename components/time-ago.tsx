'use client'

import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

export function TimeAgo({ timestamp, date }: { timestamp?: string | null; date?: string | null }) {
  // Accept either "timestamp" or "date" prop
  const value = timestamp ?? date ?? null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [display, setDisplay] = useState('')

  useEffect(() => {
    if (!value) {
      setDisplay('Never')
      return
    }

    function update() {
      try {
        setDisplay(formatDistanceToNow(new Date(value!), { addSuffix: true }))
      } catch {
        setDisplay(value!)
      }
    }

    update()
    const interval = setInterval(update, 30_000)
    return () => clearInterval(interval)
  }, [value])

  if (!value) return <span className="text-text-tertiary">Never</span>

  return (
    <span title={new Date(value).toLocaleString()}>
      {display}
    </span>
  )
}

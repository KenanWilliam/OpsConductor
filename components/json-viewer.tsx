'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

function JsonNode({ name, value, depth = 0 }: { name?: string; value: unknown; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2)

  if (value === null || value === undefined) {
    return (
      <div className="flex items-center gap-1" style={{ paddingLeft: depth * 16 }}>
        {name && <span className="text-[#7dd3fc]">{name}:</span>}
        <span className="text-text-tertiary italic">null</span>
      </div>
    )
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    const entries = Object.entries(value as Record<string, unknown>)
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 hover:bg-surface-3 rounded px-0.5"
          style={{ paddingLeft: depth * 16 }}
        >
          {expanded ? <ChevronDown className="h-3 w-3 text-text-tertiary" /> : <ChevronRight className="h-3 w-3 text-text-tertiary" />}
          {name && <span className="text-[#7dd3fc]">{name}:</span>}
          <span className="text-text-tertiary">{`{${entries.length}}`}</span>
        </button>
        {expanded && entries.map(([k, v]) => (
          <JsonNode key={k} name={k} value={v} depth={depth + 1} />
        ))}
      </div>
    )
  }

  if (Array.isArray(value)) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 hover:bg-surface-3 rounded px-0.5"
          style={{ paddingLeft: depth * 16 }}
        >
          {expanded ? <ChevronDown className="h-3 w-3 text-text-tertiary" /> : <ChevronRight className="h-3 w-3 text-text-tertiary" />}
          {name && <span className="text-[#7dd3fc]">{name}:</span>}
          <span className="text-text-tertiary">{`[${value.length}]`}</span>
        </button>
        {expanded && value.map((v, i) => (
          <JsonNode key={i} name={String(i)} value={v} depth={depth + 1} />
        ))}
      </div>
    )
  }

  const color =
    typeof value === 'string' ? 'text-[#a5d6a7]' :
    typeof value === 'number' ? 'text-[#ffcc80]' :
    typeof value === 'boolean' ? 'text-[#ce93d8]' :
    'text-text-secondary'

  return (
    <div className="flex items-center gap-1" style={{ paddingLeft: depth * 16 }}>
      {name && <span className="text-[#7dd3fc]">{name}:</span>}
      <span className={cn('font-mono text-[12px]', color)}>
        {typeof value === 'string' ? `"${value}"` : String(value)}
      </span>
    </div>
  )
}

export function JsonViewer({ data }: { data: unknown }) {
  if (!data) return <span className="text-text-tertiary italic text-[12px]">No data</span>

  return (
    <div className="rounded-md border border-border-subtle bg-surface-2 p-3 font-mono text-[12px] overflow-auto max-h-96">
      <JsonNode value={data} />
    </div>
  )
}

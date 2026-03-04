'use client'

import { BrandIcon } from '@/components/brand-icons'
import { cn } from '@/lib/utils'

export function IntegrationLogo({ provider, size = 20 }: { provider: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <BrandIcon
        name={provider}
        className={cn('h-full w-full')}
        fallback={
          <div
            className="flex items-center justify-center rounded bg-surface-3 text-[10px] font-bold text-text-secondary"
            style={{ width: size, height: size }}
          >
            {provider[0]?.toUpperCase()}
          </div>
        }
      />
    </div>
  )
}

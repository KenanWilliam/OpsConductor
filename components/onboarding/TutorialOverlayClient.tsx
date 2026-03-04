'use client'

import { useState } from 'react'
import { useWorkspace } from '@/lib/hooks/use-workspace'
import { TutorialOverlay } from './TutorialOverlay'

export function TutorialOverlayClient() {
  const { profile } = useWorkspace()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null
  if (!profile) return null
  if (profile.onboarding_completed) return null
  if (profile.onboarding_dismissed) return null

  return (
    <TutorialOverlay
      initialStep={profile.onboarding_step ?? 0}
      onComplete={() => setDismissed(true)}
    />
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const STEPS = [
  {
    id: 0,
    type: 'modal' as const,
    title: 'Welcome to OpsConductor',
    description:
      "You're about to get your AI agents under control. Let's connect your tools and create your first agent in under 2 minutes.",
    cta: "Let's go →",
    target: null,
    navigateTo: null,
  },
  {
    id: 1,
    type: 'tooltip' as const,
    title: 'Connect your tools',
    description:
      'Start by connecting at least one integration. Your agents need access to your apps to take action.',
    cta: 'Connect now',
    target: '[data-tour="integrations-nav"]',
    navigateTo: '/integrations',
  },
  {
    id: 2,
    type: 'tooltip' as const,
    title: 'Create your first agent',
    description:
      "Give your agent a role and tell it what to do. It'll use your connected tools to get work done.",
    cta: 'Create agent',
    target: '[data-tour="new-agent-button"]',
    navigateTo: '/agents/new',
  },
  {
    id: 3,
    type: 'tooltip' as const,
    title: 'Set approval rules',
    description:
      "Define what your agent can do automatically vs. what needs your review. Start with 'Always require approval' — you can relax this later.",
    cta: 'Got it',
    target: '[data-tour="approval-mode-field"]',
    navigateTo: null,
  },
  {
    id: 4,
    type: 'modal' as const,
    title: "You're all set",
    description:
      'Your cockpit is live. Approve or reject your first agent action from the Approvals page.',
    cta: 'Open cockpit',
    target: null,
    navigateTo: '/cockpit',
  },
]

interface TutorialOverlayProps {
  initialStep: number
  onComplete: () => void
}

export function TutorialOverlay({ initialStep, onComplete }: TutorialOverlayProps) {
  const [step, setStep] = useState(initialStep)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })
  const supabase = createClient()
  const router = useRouter()
  const current = STEPS[step] ?? STEPS[0]

  useEffect(() => {
    if (current.type === 'tooltip' && current.target) {
      const el = document.querySelector(current.target)
      if (el) {
        const rect = el.getBoundingClientRect()
        setTooltipPos({
          top: rect.bottom + 12,
          left: Math.max(16, Math.min(rect.left, window.innerWidth - 336)),
        })
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [step, current])

  const advance = async () => {
    const nextStep = step + 1
    await supabase.rpc('complete_onboarding_step', { p_step: nextStep })

    if (nextStep >= STEPS.length) {
      if (current.navigateTo) router.push(current.navigateTo)
      onComplete()
      return
    }

    if (current.navigateTo) {
      router.push(current.navigateTo)
    }

    setStep(nextStep)
  }

  const dismiss = async () => {
    await supabase.rpc('dismiss_onboarding')
    onComplete()
  }

  if (current.type === 'modal') {
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-surface-1 border border-border-subtle rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-1.5">
              {STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className={`h-1.5 rounded-full transition-all ${
                    i <= step ? 'w-6 bg-amber' : 'w-3 bg-surface-3'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={dismiss}
              className="text-text-tertiary hover:text-text-primary text-sm"
            >
              Skip
            </button>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">{current.title}</h2>
          <p className="text-text-secondary mb-8 leading-relaxed">{current.description}</p>
          <button
            onClick={advance}
            className="w-full bg-amber hover:bg-amber-hover text-primary-foreground font-semibold py-3 rounded-xl transition-colors"
          >
            {current.cta}
          </button>
        </div>
      </div>
    )
  }

  // Tooltip type
  return (
    <>
      <div className="fixed inset-0 z-[290] bg-black/40 pointer-events-none" />
      <div
        className="fixed z-[300] bg-surface-1 border border-amber/30 rounded-xl p-5 w-80 shadow-2xl"
        style={{ top: tooltipPos.top, left: tooltipPos.left }}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-text-primary font-semibold">{current.title}</h3>
          <button
            onClick={dismiss}
            className="text-text-tertiary hover:text-text-primary text-xs"
          >
            ✕
          </button>
        </div>
        <p className="text-text-secondary text-sm mb-4 leading-relaxed">{current.description}</p>
        <div className="flex gap-2">
          <button
            onClick={advance}
            className="flex-1 bg-amber hover:bg-amber-hover text-primary-foreground font-semibold py-2 rounded-lg text-sm transition-colors"
          >
            {current.cta}
          </button>
          <button
            onClick={dismiss}
            className="px-3 py-2 text-text-tertiary hover:text-text-primary text-sm rounded-lg border border-border-subtle"
          >
            Skip
          </button>
        </div>
        <div className="flex gap-1 mt-4 justify-center">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`h-1 rounded-full transition-all ${
                i <= step ? 'w-4 bg-amber' : 'w-2 bg-surface-3'
              }`}
            />
          ))}
        </div>
      </div>
    </>
  )
}

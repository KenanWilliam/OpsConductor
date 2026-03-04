"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Mail, Lock, ArrowRight, Loader2, Wand2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const supabase = createClient()

  // Redirect if already authenticated
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/cockpit")
    })
  }, [])

  async function handleGoogleLogin() {
    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setMessage({ type: "error", text: error.message })
      setLoading(false)
    }
  }

  async function handleGitHubLogin() {
    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setMessage({ type: "error", text: error.message })
      setLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage({ type: "error", text: error.message })
      setLoading(false)
    } else {
      router.push("/cockpit")
    }
  }

  async function handleMagicLink() {
    if (!email) {
      setMessage({ type: "error", text: "Enter your email first." })
      return
    }
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (error) {
      setMessage({ type: "error", text: error.message })
    } else {
      setMessage({ type: "success", text: "Check your email for the login link!" })
    }
    setLoading(false)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)] bg-[size:64px_64px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/icon.svg" alt="OpsConductor" width={32} height={32} className="h-8 w-8" />
            <img src="/brand/wordmark.svg" alt="OpsConductor" className="h-6 dark:block hidden" />
            <img src="/brand/wordmark-dark.svg" alt="OpsConductor" className="h-6 dark:hidden block" />
          </Link>
          <p className="text-[13px] text-text-secondary">Welcome back. Sign in to your workspace.</p>
        </div>

        {/* Feedback message */}
        {message && (
          <div className={cn(
            "mb-4 rounded-md p-3 text-[13px]",
            message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
          )}>
            {message.text}
          </div>
        )}

        {/* OAuth */}
        <div className="flex flex-col gap-2.5">
          <button onClick={handleGoogleLogin} disabled={loading} className="flex h-10 items-center justify-center gap-2.5 rounded-md border border-border-base bg-surface-1 text-[13px] font-medium text-text-primary transition-colors hover:bg-surface-2 disabled:opacity-50">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M15.68 8.18c0-.57-.05-1.11-.14-1.64H8v3.1h4.3a3.68 3.68 0 01-1.6 2.41v2h2.59c1.51-1.4 2.39-3.45 2.39-5.87z" fill="#4285F4"/>
              <path d="M8 16c2.16 0 3.97-.72 5.29-1.94l-2.59-2a5.05 5.05 0 01-7.52-2.65H.58v2.06A8 8 0 008 16z" fill="#34A853"/>
              <path d="M3.18 9.41a4.8 4.8 0 010-2.82V4.53H.58a8 8 0 000 6.94l2.6-2.06z" fill="#FBBC05"/>
              <path d="M8 3.18a4.33 4.33 0 013.07 1.2l2.3-2.3A7.72 7.72 0 008 0 8 8 0 00.58 4.53l2.6 2.06A4.77 4.77 0 018 3.18z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <button onClick={handleGitHubLogin} disabled={loading} className="flex h-10 items-center justify-center gap-2.5 rounded-md border border-border-base bg-surface-1 text-[13px] font-medium text-text-primary transition-colors hover:bg-surface-2 disabled:opacity-50">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border-subtle" />
          <span className="text-[11px] text-text-tertiary">or</span>
          <div className="h-px flex-1 bg-border-subtle" />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-[11px] font-medium text-text-secondary">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="h-10 w-full rounded-md border border-border-base bg-surface-1 pl-9 pr-3 text-[13px] text-text-primary placeholder:text-text-tertiary focus:border-cyan focus:shadow-[0_0_0_3px_rgba(0,194,255,0.12)] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-[11px] font-medium text-text-secondary">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="h-10 w-full rounded-md border border-border-base bg-surface-1 pl-9 pr-3 text-[13px] text-text-primary placeholder:text-text-tertiary focus:border-cyan focus:shadow-[0_0_0_3px_rgba(0,194,255,0.12)] focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex h-10 items-center justify-center gap-2 rounded-md btn-primary text-[13px] font-semibold text-white transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        {/* Magic link alternative */}
        <button
          type="button"
          onClick={handleMagicLink}
          disabled={loading}
          className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-md border border-border-base bg-surface-1 text-[12px] font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary disabled:opacity-50"
        >
          <Wand2 className="h-3.5 w-3.5" /> Sign in with magic link
        </button>

        <p className="mt-5 text-center text-[13px] text-text-tertiary">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-cyan transition-colors hover:text-cyan-muted">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

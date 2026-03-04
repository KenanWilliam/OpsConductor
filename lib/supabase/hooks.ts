"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "./client"
import type { User } from "@supabase/supabase-js"

/* ── Authenticated user hook ── */
export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/login"
  }, [])

  return { user, loading, signOut }
}

/* ── User display info helper ── */
export function getUserDisplayInfo(user: User | null) {
  if (!user) return { name: "Guest", email: "", initials: "?" }

  const meta = user.user_metadata ?? {}
  const name =
    meta.full_name ||
    meta.name ||
    meta.preferred_username ||
    user.email?.split("@")[0] ||
    "User"
  const email = user.email || ""
  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return { name, email, initials }
}

/* ── Generic Supabase table hook ── */
export function useSupabaseQuery<T>(
  table: string,
  options?: {
    select?: string
    orderBy?: string
    ascending?: boolean
    limit?: number
    filters?: Record<string, unknown>
  }
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()

    async function fetch() {
      try {
        let query = supabase.from(table).select(options?.select ?? "*")

        if (options?.filters) {
          for (const [key, value] of Object.entries(options.filters)) {
            query = query.eq(key, value)
          }
        }
        if (options?.orderBy) {
          query = query.order(options.orderBy, {
            ascending: options.ascending ?? false,
          })
        }
        if (options?.limit) {
          query = query.limit(options.limit)
        }

        const { data, error } = await query
        if (cancelled) return
        if (error) {
          // Table doesn't exist yet — not an error for the user
          setError(error.message)
          setData([])
        } else {
          setData((data as T[]) ?? [])
        }
      } catch {
        if (!cancelled) setError("Failed to fetch data")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()
    return () => {
      cancelled = true
    }
  }, [table, options?.select, options?.orderBy, options?.ascending, options?.limit])

  return { data, loading, error }
}

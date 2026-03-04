'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useWorkspace } from './use-workspace'
import type { DbEvent } from '@/lib/types'

export function useRealtimeEvents(limit = 50) {
  const { workspace } = useWorkspace()
  const [events, setEvents] = useState<DbEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)

  const fetchEvents = useCallback(async () => {
    if (!workspace?.id) return
    const supabase = createClient()
    const { data } = await supabase
      .from('events')
      .select('*, agent:agents!agent_id(id, name, role)')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (data) setEvents(data as DbEvent[])
    setIsLoading(false)
  }, [workspace?.id, limit])

  useEffect(() => {
    if (!workspace?.id) return

    fetchEvents()

    const supabase = createClient()
    const channel = supabase
      .channel('events-feed')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'events',
          filter: `workspace_id=eq.${workspace.id}`,
        },
        async (payload) => {
          // Fetch the full event with agent join
          const { data } = await supabase
            .from('events')
            .select('*, agent:agents!agent_id(id, name, role)')
            .eq('id', (payload.new as DbEvent).id)
            .single()
          if (data) {
            setEvents((prev) => [data as DbEvent, ...prev].slice(0, limit))
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspace?.id, limit, fetchEvents])

  return { events, isConnected, isLoading, refetch: fetchEvents }
}

export function useRealtimePendingCount() {
  const { workspace } = useWorkspace()
  const [count, setCount] = useState(0)

  const fetchCount = useCallback(async () => {
    if (!workspace?.id) return
    const supabase = createClient()
    const { count: c } = await supabase
      .from('approvals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
    setCount(c ?? 0)
  }, [workspace?.id])

  useEffect(() => {
    if (!workspace?.id) return
    fetchCount()

    const supabase = createClient()
    const channel = supabase
      .channel('approvals-count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'approvals',
          filter: `workspace_id=eq.${workspace.id}`,
        },
        () => { fetchCount() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [workspace?.id, fetchCount])

  return count
}

export function useRealtimeNotifications() {
  const { workspace, profile } = useWorkspace()
  const [notifications, setNotifications] = useState<Array<{
    id: string; type: string | null; title: string; body: string | null; link: string | null; read: boolean; related_id: string | null; created_at: string
  }>>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = useCallback(async () => {
    if (!workspace?.id || !profile?.id) return
    const supabase = createClient()
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) {
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.read).length)
    }
  }, [workspace?.id, profile?.id])

  useEffect(() => {
    if (!workspace?.id || !profile?.id) return
    fetchNotifications()

    const supabase = createClient()
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `profile_id=eq.${profile.id}`,
        },
        () => { fetchNotifications() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [workspace?.id, profile?.id, fetchNotifications])

  const markAllRead = useCallback(async () => {
    if (!profile?.id) return
    const supabase = createClient()
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('profile_id', profile.id)
      .eq('read', false)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }, [profile?.id])

  return { notifications, unreadCount, markAllRead, refetch: fetchNotifications }
}

/* ── Approvals realtime subscription ── */
export function useRealtimeApprovals(workspaceId: string | undefined, onUpdate: () => void) {
  useEffect(() => {
    if (!workspaceId) return

    const supabase = createClient()
    const channel = supabase
      .channel('approvals-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'approvals',
          filter: `workspace_id=eq.${workspaceId}`,
        },
        () => { onUpdate() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [workspaceId, onUpdate])
}

/* ── Agent status realtime subscription ── */
export function useRealtimeAgents(workspaceId: string | undefined, onUpdate: () => void) {
  useEffect(() => {
    if (!workspaceId) return

    const supabase = createClient()
    const channel = supabase
      .channel('agents-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agents',
          filter: `workspace_id=eq.${workspaceId}`,
        },
        () => { onUpdate() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [workspaceId, onUpdate])
}

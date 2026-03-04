'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Workspace, Profile } from '@/lib/types'
import type { User } from '@supabase/supabase-js'

interface WorkspaceContextValue {
  workspace: Workspace | null
  profile: Profile | null
  user: User | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const WorkspaceContext = createContext<WorkspaceContextValue>({
  workspace: null,
  profile: null,
  user: null,
  isLoading: true,
  error: null,
  refetch: async () => {},
})

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchWorkspaceData() {
    const supabase = createClient()

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        setIsLoading(false)
        return
      }
      setUser(authUser)

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profileError) {
        setError(profileError.message)
        setIsLoading(false)
        return
      }
      setProfile(profileData)

      // Fetch workspace
      if (profileData?.workspace_id) {
        const { data: workspaceData, error: wsError } = await supabase
          .from('workspaces')
          .select('*')
          .eq('id', profileData.workspace_id)
          .single()

        if (wsError) {
          setError(wsError.message)
        } else {
          setWorkspace(workspaceData)
        }
      }
    } catch (err) {
      setError('Failed to load workspace data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkspaceData()
  }, [])

  return (
    <WorkspaceContext.Provider value={{ workspace, profile, user, isLoading, error, refetch: fetchWorkspaceData }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  return useContext(WorkspaceContext)
}

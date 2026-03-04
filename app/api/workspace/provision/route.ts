import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * POST /api/workspace/provision
 *
 * Called after auth callback to ensure the authenticated user
 * has a workspace + membership. If they don't, create one.
 *
 * This fixes the "dead-end" where handle_new_user() creates a
 * profile row but no workspace, causing my_workspace_id() to
 * return NULL and all RLS policies to block.
 */
export async function POST() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options))
        },
      },
    }
  )

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Check if user already has a workspace membership
  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (membership?.workspace_id) {
    return NextResponse.json({ workspace_id: membership.workspace_id, created: false })
  }

  // No workspace found — create one
  const workspaceName =
    user.user_metadata?.workspace_name ||
    `${user.user_metadata?.full_name || user.email?.split('@')[0] || 'My'}'s Workspace`

  // Insert workspace
  const { data: workspace, error: wsError } = await supabase
    .from('workspaces')
    .insert({ name: workspaceName })
    .select('id')
    .single()

  if (wsError || !workspace) {
    // If table doesn't exist yet, just redirect — no DB provisioned yet
    console.error('Workspace creation failed:', wsError?.message)
    return NextResponse.json({ error: 'Workspace creation failed', details: wsError?.message }, { status: 500 })
  }

  // Create membership linking user to workspace as owner
  const { error: memError } = await supabase
    .from('workspace_members')
    .insert({
      workspace_id: workspace.id,
      user_id: user.id,
      role: 'owner',
    })

  if (memError) {
    console.error('Membership creation failed:', memError.message)
    return NextResponse.json({ error: 'Membership creation failed', details: memError.message }, { status: 500 })
  }

  // Ensure profile exists (handle_new_user may have already created this)
  await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
    }, { onConflict: 'id' })

  return NextResponse.json({ workspace_id: workspace.id, created: true })
}

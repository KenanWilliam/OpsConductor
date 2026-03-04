import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 })

  // Get agent and profile for workspace_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('workspace_id')
    .eq('id', user.id)
    .single()

  if (!profile) return Response.json({ error: 'no_profile' }, { status: 400 })

  // Create a run
  const { data: run, error: runError } = await supabase
    .from('agent_runs')
    .insert({
      agent_id: id,
      workspace_id: profile.workspace_id,
      triggered_by: 'manual',
      status: 'running',
    })
    .select()
    .single()

  if (runError) return Response.json({ error: runError.message }, { status: 400 })

  // Update agent status to running
  await supabase
    .from('agents')
    .update({ status: 'running', last_run_at: new Date().toISOString() })
    .eq('id', id)

  // Increment run_count
  const { data: agent } = await supabase
    .from('agents')
    .select('run_count')
    .eq('id', id)
    .single()
  if (agent) {
    await supabase
      .from('agents')
      .update({ run_count: (agent.run_count || 0) + 1 })
      .eq('id', id)
  }

  return Response.json(run)
}

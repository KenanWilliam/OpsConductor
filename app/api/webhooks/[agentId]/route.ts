import { createServiceRoleClient } from '@/lib/supabase/service'
import { NextRequest } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params
    const body = await req.json()
    const supabase = createServiceRoleClient()

    // Verify agent exists and has webhook trigger
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('id, workspace_id, status')
      .eq('id', agentId)
      .eq('trigger_type', 'webhook')
      .single()

    if (!agent || agentError) {
      return Response.json({ error: 'not_found' }, { status: 404 })
    }

    if (agent.status === 'archived') {
      return Response.json({ error: 'agent_archived' }, { status: 410 })
    }

    // Create a run
    const { error: runError } = await supabase.from('agent_runs').insert({
      agent_id: agent.id,
      workspace_id: agent.workspace_id,
      triggered_by: 'webhook',
      status: 'running',
      metadata: { webhook_payload: body },
    })

    if (runError) {
      return Response.json({ error: runError.message }, { status: 500 })
    }

    // Update agent status
    await supabase
      .from('agents')
      .update({ status: 'running' })
      .eq('id', agent.id)

    return Response.json({ received: true })
  } catch {
    return Response.json({ error: 'invalid_payload' }, { status: 400 })
  }
}

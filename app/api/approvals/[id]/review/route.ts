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

  const { decision, note, editContent } = await req.json()

  const { data, error } = await supabase.rpc('review_approval', {
    p_approval_id: id,
    p_decision: decision,
    p_note: note ?? null,
    p_edit_content: editContent ?? null,
  })

  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json(data)
}

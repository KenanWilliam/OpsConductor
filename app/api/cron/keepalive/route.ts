import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  await supabase.from('workspaces').select('id').limit(1)
  return Response.json({ ok: true, ts: new Date().toISOString() })
}

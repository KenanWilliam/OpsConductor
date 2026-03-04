import type { PostgrestError } from '@supabase/supabase-js'
import { toast } from 'sonner'

export function handleSupabaseError(error: PostgrestError): string {
  if (error.code === 'P0010') return 'Agent limit reached for your plan'
  if (error.code === 'P0060') return 'Too many requests, please slow down'
  if (error.code === '42501') return 'Permission denied'
  if (error.code === 'PGRST116') return 'Record not found'
  if (error.code === '23505') return 'A record with that name already exists'
  if (error.code === '23503') return 'Referenced record not found'
  return error.message
}

export function toastError(error: PostgrestError | Error | string) {
  const message =
    typeof error === 'string'
      ? error
      : 'code' in (error as PostgrestError)
        ? handleSupabaseError(error as PostgrestError)
        : (error as Error).message
  toast.error(message)
}

export function toastSuccess(message: string) {
  toast.success(message)
}

import type { PostgrestError } from '@supabase/supabase-js'
import { toast } from 'sonner'

const ERROR_MAP: Record<string, string> = {
  'P0001': 'Event quota exceeded. Upgrade your plan.',
  'P0002': 'Invalid decision.',
  'P0003': 'Note too long (max 2000 characters).',
  'P0004': 'Not authenticated.',
  'P0005': 'Record not found.',
  'P0006': 'Already resolved.',
  'P0007': 'Approval has expired.',
  'P0008': 'Content too large (max 100KB).',
  'P0010': 'Agent limit reached for your plan.',
  'P0011': 'Notification quota exceeded.',
  'P0030': 'You cannot change your own role.',
  'P0040': 'Agent is not runnable (archived or error state).',
  'P0050': 'Cannot delete workspace with running agents.',
  'P0060': 'Too many requests. Please slow down.',
  '23514': 'Value failed validation. Check field length and format.',
  '23505': 'This record already exists.',
  '23503': 'Referenced record not found.',
  '42501': 'Permission denied.',
  'PGRST116': 'Record not found.',
  'PGRST301': 'Request timed out.',
}

export function handleSupabaseError(error: PostgrestError): string {
  return ERROR_MAP[error.code ?? ''] ?? error.message ?? 'An unexpected error occurred.'
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

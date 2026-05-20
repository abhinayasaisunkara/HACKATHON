import { supabaseAdmin } from './supabase'
import { JWTPayload } from './auth'

export async function logAudit(
  user: JWTPayload,
  action: string,
  entityType: string,
  entityId: string,
  oldValues?: any,
  newValues?: any
): Promise<void> {
  await supabaseAdmin
    .from('audit_logs')
    .insert({
      user_id: user.userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      old_values: oldValues,
      new_values: newValues,
    })
}

export async function getAuditLogs(filters: {
  userId?: string
  action?: string
  limit?: number
  offset?: number
} = {}) {
  let query = supabaseAdmin
    .from('audit_logs')
    .select('*, users:user_id(email, name)')
    .order('created_at', { ascending: false })

  if (filters.userId) query = query.eq('user_id', filters.userId)
  if (filters.action) query = query.eq('action', filters.action)
  if (filters.limit) query = query.limit(filters.limit)
  if (filters.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)

  const { data, error } = await query
  if (error) throw error
  return data
}
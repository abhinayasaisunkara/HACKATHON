import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/auth'
import { supabaseAdmin } from '@/app/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string, id: string } }
) {
  try {
    const payload = await requireAuth(request)

    // Ensure they have right roles to view entity audit logs
    if (payload.role !== 'SUPER_ADMIN' && payload.role !== 'COMPLIANCE_OFFICER' && payload.role !== 'OPERATOR') {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 })
    }

    const { type, id } = params

    const { data: logs, error } = await supabaseAdmin
      .from('audit_logs')
      .select('*, users:user_id(email, name)')
      .eq('entity_type', type)
      .eq('entity_id', id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: logs
    })
  } catch (error: any) {
    console.error('Audit Entity Error:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

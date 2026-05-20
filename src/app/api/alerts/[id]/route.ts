import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/auth'
import { supabaseAdmin } from '@/app/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await requireAuth(request)
    
    // Roles: SUPER_ADMIN, COMPLIANCE_OFFICER, OPERATOR
    if (payload.role !== 'SUPER_ADMIN' && payload.role !== 'COMPLIANCE_OFFICER' && payload.role !== 'OPERATOR') {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 })
    }

    const { id } = params

    const { data: alert, error } = await supabaseAdmin
      .from('alerts')
      .select('*, alert_recipients(user_id, delivered, read_at)')
      .eq('id', id)
      .single()

    if (error || !alert) {
      console.error('Database error fetching alert:', error)
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: alert
    })
  } catch (error: any) {
    console.error('Alert Error:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

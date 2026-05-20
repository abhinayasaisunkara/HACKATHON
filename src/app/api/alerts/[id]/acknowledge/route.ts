import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/auth'
import { supabaseAdmin } from '@/app/lib/supabase'

export async function PUT(
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

    // Check if alert exists
    const { data: alert, error: fetchError } = await supabaseAdmin
      .from('alerts')
      .select('id, acknowledged')
      .eq('id', id)
      .single()

    if (fetchError || !alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
    }

    if (alert.acknowledged) {
      return NextResponse.json({ error: 'Alert already acknowledged' }, { status: 400 })
    }

    const { data: updatedAlert, error: updateError } = await supabaseAdmin
      .from('alerts')
      .update({
        acknowledged: true
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError || !updatedAlert) {
      console.error('Database error updating alert:', updateError)
      return NextResponse.json({ error: 'Failed to acknowledge alert' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: updatedAlert
    })
  } catch (error: any) {
    console.error('Acknowledge Alert Error:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

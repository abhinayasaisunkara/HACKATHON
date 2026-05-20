import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/auth'
import { supabaseAdmin } from '@/app/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { customerRef: string } }
) {
  try {
    const payload = await requireAuth(request)

    // RBAC: superadmin, viewer, compliance, operator
    const allowedRoles = ['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'OPERATOR', 'VIEWER']
    if (!allowedRoles.includes(payload.role)) {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 })
    }

    const { customerRef } = params

    // First fetch the investor ID
    const { data: investor, error: investorError } = await supabaseAdmin
      .from('investors')
      .select('id')
      .eq('mf_customer_ref', customerRef)
      .single()

    if (investorError || !investor) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const { data: sips, error } = await supabaseAdmin
      .from('mf_sips')
      .select('*, securities(security_code, security_name)')
      .eq('investor_id', investor.id)
      .eq('sip_status', 'ACTIVE') // User asked for active SIPs
      .order('next_due_date', { ascending: true })

    if (error) {
      console.error('Database error fetching MF active SIPs:', error)
      return NextResponse.json({ error: 'Failed to fetch customer active SIPs' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: sips
    })
  } catch (error: any) {
    console.error('MF Active SIPs Error:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

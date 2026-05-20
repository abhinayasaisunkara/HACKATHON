import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/auth'
import { supabaseAdmin } from '@/app/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const payload = await requireAuth(request)

    // RBAC: superadmin, viewer, compliance, operator
    const allowedRoles = ['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'OPERATOR', 'VIEWER']
    if (!allowedRoles.includes(payload.role)) {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data: transactions, error } = await supabaseAdmin
      .from('mf_transactions')
      .select('*, securities(security_code, security_name), investors(mf_customer_ref, full_name, pan_number)')
      .order('executed_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Database error fetching MF transactions:', error)
      return NextResponse.json({ error: 'Failed to fetch mutual fund transactions' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: transactions
    })
  } catch (error: any) {
    console.error('MF Transactions Error:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/auth'
import { supabaseAdmin } from '@/app/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const payload = await requireAuth(request)
    const { userId } = params

    // Only allow SUPER_ADMIN, COMPLIANCE_OFFICER, or the user themselves
    if (payload.role !== 'SUPER_ADMIN' && payload.role !== 'COMPLIANCE_OFFICER' && payload.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data: logs, error } = await supabaseAdmin
      .from('audit_logs')
      .select('*, users:user_id(email, name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch user audit logs' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: logs
    })
  } catch (error: any) {
    console.error('Audit User Error:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

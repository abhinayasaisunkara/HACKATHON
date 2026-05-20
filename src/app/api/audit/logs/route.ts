import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/auth'
import { getAuditLogs } from '@/app/lib/audit'

export async function GET(request: NextRequest) {
  try {
    const payload = await requireAuth(request)

    // Only allow SUPER_ADMIN and COMPLIANCE_OFFICER to view all logs
    if (payload.role !== 'SUPER_ADMIN' && payload.role !== 'COMPLIANCE_OFFICER') {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const action = searchParams.get('action') || undefined

    const logs = await getAuditLogs({ limit, offset, action })

    return NextResponse.json({
      success: true,
      data: logs
    })
  } catch (error: any) {
    console.error('Audit Logs Error:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

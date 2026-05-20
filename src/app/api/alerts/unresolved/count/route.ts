import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/auth'
import { supabaseAdmin } from '@/app/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const payload = await requireAuth(request)

    // Roles: SUPER_ADMIN, COMPLIANCE_OFFICER, OPERATOR
    if (payload.role !== 'SUPER_ADMIN' && payload.role !== 'COMPLIANCE_OFFICER' && payload.role !== 'OPERATOR') {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 })
    }

    // Usually we would check Redis for a cached count here if implementing high-performance caching
    // const cachedCount = await redis.get('alerts:unresolved:count');
    // if (cachedCount) return NextResponse.json({ count: parseInt(cachedCount) });

    const { count, error } = await supabaseAdmin
      .from('alerts')
      .select('*', { count: 'exact', head: true })
      .eq('acknowledged', false)

    if (error) {
      console.error('Database error fetching unresolved alerts count:', error)
      return NextResponse.json({ error: 'Failed to fetch unresolved alerts count' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      count: count || 0
    })
  } catch (error: any) {
    console.error('Unresolved Alerts Count Error:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

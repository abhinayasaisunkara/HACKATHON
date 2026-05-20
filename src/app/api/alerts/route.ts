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

    const { searchParams } = new URL(request.url)
    const acknowledged = searchParams.get('acknowledged')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabaseAdmin
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (acknowledged !== null) {
      query = query.eq('acknowledged', acknowledged === 'true')
    }

    const { data: alerts, error } = await query

    if (error) {
      console.error('Database error fetching alerts:', error)
      return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: alerts
    })
  } catch (error: any) {
    console.error('Alerts Error:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await requireAuth(request)
    
    // Check if the user has permission to create alerts
    if (payload.role !== 'SUPER_ADMIN' && payload.role !== 'COMPLIANCE_OFFICER' && payload.role !== 'OPERATOR') {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 })
    }

    const body = await request.json()
    const { type, message, severity, transaction_id } = body

    if (!type || !message || !severity) {
      return NextResponse.json(
        { error: 'type, message, and severity are required fields' },
        { status: 400 }
      )
    }

    const { data: newAlert, error } = await supabaseAdmin
      .from('alerts')
      .insert({
        type,
        message,
        severity,
        transaction_id: transaction_id || null,
        acknowledged: false
      })
      .select()
      .single()

    if (error) {
      console.error('Database error creating alert:', error)
      return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: newAlert
    }, { status: 201 })

  } catch (error: any) {
    console.error('Create Alert Error:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

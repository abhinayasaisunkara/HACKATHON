import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/auth'
import { supabaseAdmin } from '@/app/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const payload = await requireAuth(request)

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, name, role_id, roles(name), is_active')
      .eq('id', payload.userId)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.roles?.name || payload.role,
        is_active: user.is_active,
      }
    })
  } catch (error: any) {
    console.error('Auth error:', error)
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

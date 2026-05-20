import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabase'
import { hashPassword, generateAccessToken, generateRefreshToken, storeRefreshToken } from '@/app/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role = 'OPERATOR' } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)
    
    // Get the role ID
    const { data: roleData } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('name', role)
      .maybeSingle()

    let roleId = roleData?.id

    if (!roleId) {
      // In case roles are not properly seeded, fall back to inserting the role
      const { data: newRole } = await supabaseAdmin
        .from('roles')
        .insert({ name: role, description: 'Operations Operator' })
        .select()
        .single()
      roleId = newRole?.id
    }

    // Insert user
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password_hash: hashedPassword,
        name,
        role_id: roleId,
        is_active: true
      })
      .select()
      .single()

    if (error || !newUser) {
      console.error('Error creating user:', error)
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    const payload = {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role || role,
    }

    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
    await storeRefreshToken(newUser.id, refreshToken, expiresAt)

    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role || role,
      },
      accessToken,
    }, { status: 201 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

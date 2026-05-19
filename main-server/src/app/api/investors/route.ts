import { NextResponse } from 'next/server'

const BACKEND_A = process.env.BACKEND_A_URL || 'http://localhost:3001'

export async function GET() {
  try {
    const response = await fetch(BACKEND_A + '/api/investors')
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
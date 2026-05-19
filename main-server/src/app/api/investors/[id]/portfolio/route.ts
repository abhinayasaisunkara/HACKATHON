import { NextResponse } from 'next/server'

const BACKEND_A = process.env.BACKEND_A_URL || 'http://localhost:3001'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = BACKEND_A + '/api/investors/' + params.id + '/portfolio'
    const response = await fetch(url)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
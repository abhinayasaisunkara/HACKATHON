import { NextResponse } from 'next/server'

const BACKEND_B = process.env.BACKEND_B_URL || 'http://localhost:3002'

export async function GET() {
    try {
        const response = await fetch(`${BACKEND_B}/api/alerts`)
        const data = await response.json()
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'Main Server is running!',
        timestamp: new Date().toISOString()
    })
}
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabase'

export async function GET() {
  try {
    // Basic health check for db connection
    const { error } = await supabaseAdmin.from('roles').select('id').limit(1)

    if (error) {
      console.error('Health check DB error:', error)
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        timestamp: new Date().toISOString()
      }, { status: 503 })
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Service is healthy',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Health check unexpected error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error occurred',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

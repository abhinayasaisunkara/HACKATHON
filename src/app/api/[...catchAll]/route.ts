import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return handleNotFound(request)
}

export async function POST(request: NextRequest) {
  return handleNotFound(request)
}

export async function PUT(request: NextRequest) {
  return handleNotFound(request)
}

export async function DELETE(request: NextRequest) {
  return handleNotFound(request)
}

export async function PATCH(request: NextRequest) {
  return handleNotFound(request)
}

function handleNotFound(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Not Found', 
      message: `The requested endpoint ${request.nextUrl.pathname} does not exist.` 
    }, 
    { status: 404 }
  )
}

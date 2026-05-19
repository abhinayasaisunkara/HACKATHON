import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Backend A is running!",
    timestamp: new Date().toISOString()
  })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

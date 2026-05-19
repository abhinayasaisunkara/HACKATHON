import { NextResponse } from "next/server"
import { transactionService } from "@/lib/services/transaction.service"

export async function POST() {
  try {
    const result = await transactionService.syncFromExternal()
    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

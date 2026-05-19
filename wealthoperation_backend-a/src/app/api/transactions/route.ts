import { NextRequest, NextResponse } from "next/server"
import { transactionService } from "@/lib/services/transaction.service"

export async function GET(request: NextRequest) {
  try {
    const transactions = await transactionService.getAllTransactions({})
    return NextResponse.json({ success: true, data: transactions })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

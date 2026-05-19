import { NextResponse } from 'next/server'
import { transactionService } from '@/lib/services/transaction.service'

export async function POST() {
    // Only sync EQUITY transactions
    const result = await transactionService.syncEquityOnly()
    return NextResponse.json({ success: true, data: result })
}
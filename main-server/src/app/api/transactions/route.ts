import { NextResponse } from 'next/server'

const BACKEND_A = process.env.BACKEND_A_URL || 'http://localhost:3001'
const BACKEND_B = process.env.BACKEND_B_URL || 'http://localhost:3002'

export async function GET() {
    try {
        const [equityRes, mfRes] = await Promise.all([
            fetch(`${BACKEND_A}/api/transactions`).catch(() => ({ ok: false, json: async () => ({ data: [] }) })),
            fetch(`${BACKEND_B}/api/mf/transactions`).catch(() => ({ ok: false, json: async () => ({ data: [] }) }))
        ])

        const equity = await equityRes.json()
        const mf = await mfRes.json()

        const allTransactions = [...(equity.data || []), ...(mf.data || [])]

        return NextResponse.json({
            success: true,
            data: allTransactions,
            count: allTransactions.length
        })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        server: 'Backend A - Equity & Workflow Engine',
        port: 3001,
        services: {
            equity_transactions: true,
            workflow_engine: true,
            compliance_rules: true,
            approvals: true
        }
    })
}
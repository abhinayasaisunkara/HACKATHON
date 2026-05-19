@"
export type TransactionStatus =
    | 'PENDING_REVIEW'
    | 'UNDER_REVIEW'
    | 'APPROVED'
    | 'REJECTED'
    | 'ESCALATED'
    | 'COMPLETED'

export type TransactionType =
    | 'BUY'
    | 'SELL'
    | 'SIP_INVESTMENT'
    | 'SIP_FAILURE'

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface Transaction {
    id: string
    external_id: string
    source: 'EQUITY' | 'MUTUAL_FUND'
    investor_id: string
    investor_name: string | null
    amount: number
    type: TransactionType
    status: TransactionStatus
    symbol: string | null
    created_at: string
}

export interface ComplianceFlag {
    id: string
    transaction_id: string
    rule_name: string
    severity: Severity
    description: string
    resolved: boolean
    created_at: string
}

export interface Workflow {
    id: string
    transaction_id: string
    current_step: TransactionStatus
    step_history: any[]
}

export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: string
}
"@ | Out-File -FilePath src\lib\types\index.ts -Encoding utf8 -Force
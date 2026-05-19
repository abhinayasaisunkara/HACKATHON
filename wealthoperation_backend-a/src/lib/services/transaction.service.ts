import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Mock data for testing
const mockTransactions = [
    {
        external_id: 'EQ_001',
        source: 'EQUITY',
        investor_id: 'INV_001',
        investor_name: 'Ramesh Kumar',
        amount: 1050000,
        type: 'BUY',
        symbol: 'RELIANCE'
    },
    {
        external_id: 'EQ_002',
        source: 'EQUITY',
        investor_id: 'INV_002',
        investor_name: 'Priya Sharma',
        amount: 500000,
        type: 'BUY',
        symbol: 'HDFC'
    },
    {
        external_id: 'MF_001',
        source: 'MUTUAL_FUND',
        investor_id: 'INV_003',
        investor_name: 'Amit Patel',
        amount: 5000,
        type: 'SIP_INVESTMENT',
        symbol: 'HDFC Balanced'
    }
]

export class TransactionService {

    async syncFromExternal(): Promise<{ equity: number; mf: number }> {
        console.log('[Transaction] Syncing mock data...')

        let equityCount = 0
        let mfCount = 0

        for (const tx of mockTransactions) {
            // Check if already exists
            const { data: existing } = await supabase
                .from('transactions')
                .select('id')
                .eq('external_id', tx.external_id)
                .single()

            if (existing) {
                console.log(`Duplicate ${tx.external_id}, skipping`)
                continue
            }

            // Insert into transactions table
            const { error } = await supabase
                .from('transactions')
                .insert({
                    external_id: tx.external_id,
                    source: tx.source,
                    investor_id: tx.investor_id,
                    investor_name: tx.investor_name,
                    amount: tx.amount,
                    type: tx.type,
                    symbol: tx.symbol,
                    status: 'PENDING_REVIEW'
                })

            if (!error) {
                if (tx.source === 'EQUITY') equityCount++
                else mfCount++

                // Also create a workflow entry
                await supabase.from('workflows').insert({
                    transaction_id: tx.external_id === 'EQ_001' ?
                        (await supabase.from('transactions').select('id').eq('external_id', tx.external_id).single()).data?.id :
                        null,
                    current_step: 'PENDING_REVIEW',
                    step_history: []
                })
            }
        }

        return { equity: equityCount, mf: mfCount }
    }

    async getAllTransactions(): Promise<any[]> {
        // Simple select without joins
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching transactions:', error)
            return []
        }

        return data || []
    }
}

export const transactionService = new TransactionService()
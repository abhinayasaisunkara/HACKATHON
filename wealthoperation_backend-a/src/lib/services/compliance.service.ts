import { createClient } from '@supabase/supabase-js'
import type { ComplianceFlag } from '@/lib/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export class ComplianceService {

    async checkTransaction(
        transactionId: string,
        amount: number,
        investorId: string,
        transactionType: string
    ): Promise<ComplianceFlag[]> {

        console.log(`[Compliance] Checking transaction ${transactionId}`)
        const flags: ComplianceFlag[] = []

        // RULE 1: Large Transaction (> ₹5,00,000)
        if (amount > 500000) {
            flags.push({
                id: '',
                transaction_id: transactionId,
                rule_name: 'LARGE_TRANSACTION',
                severity: 'MEDIUM',
                description: `Amount ₹${amount.toLocaleString('en-IN')} exceeds ₹5,00,000 limit`,
                resolved: false,
                created_at: new Date().toISOString()
            })
            console.log(`  → Rule 1: Large transaction ₹${amount}`)
        }

        // RULE 2: Very Large Transaction (> ₹10,00,000)
        if (amount > 1000000) {
            flags.push({
                id: '',
                transaction_id: transactionId,
                rule_name: 'VERY_LARGE_TRANSACTION',
                severity: 'HIGH',
                description: `Amount ₹${amount.toLocaleString('en-IN')} exceeds ₹10,00,000 - compliance required`,
                resolved: false,
                created_at: new Date().toISOString()
            })
            console.log(`  → Rule 2: Very large transaction ₹${amount}`)
        }

        // Save all flags to database
        for (const flag of flags) {
            await supabase.from('compliance_flags').insert({
                transaction_id: flag.transaction_id,
                rule_name: flag.rule_name,
                severity: flag.severity,
                description: flag.description
            })
        }

        console.log(`[Compliance] Found ${flags.length} flags for ${transactionId}`)
        return flags
    }
}

export const complianceService = new ComplianceService()
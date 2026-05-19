import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export class WorkflowService {

    async approve(transactionId: string, userId: string, comments?: string): Promise<void> {
        // Update transaction status
        await supabase
            .from('transactions')
            .update({ status: 'COMPLETED' })
            .eq('id', transactionId)

        // Record approval
        await supabase.from('approvals').insert({
            transaction_id: transactionId,
            user_id: userId,
            decision: 'APPROVE',
            comments: comments || null
        })

        console.log(`✅ Approved: ${transactionId}`)
    }

    async reject(transactionId: string, userId: string, comments?: string): Promise<void> {
        // Update transaction status
        await supabase
            .from('transactions')
            .update({ status: 'REJECTED' })
            .eq('id', transactionId)

        // Record rejection
        await supabase.from('approvals').insert({
            transaction_id: transactionId,
            user_id: userId,
            decision: 'REJECT',
            comments: comments || null
        })

        // Create alert
        await supabase.from('alerts').insert({
            transaction_id: transactionId,
            type: 'TRANSACTION_REJECTED',
            severity: 'HIGH',
            message: `Transaction ${transactionId} rejected by ${userId}`
        })

        console.log(`❌ Rejected: ${transactionId}`)
    }

    async escalate(transactionId: string, userId: string, comments?: string): Promise<void> {
        // Update transaction status
        await supabase
            .from('transactions')
            .update({ status: 'ESCALATED' })
            .eq('id', transactionId)

        // Record escalation
        await supabase.from('approvals').insert({
            transaction_id: transactionId,
            user_id: userId,
            decision: 'ESCALATE',
            comments: comments || null
        })

        // Create escalation record
        await supabase.from('escalations').insert({
            transaction_id: transactionId,
            reason: comments || 'Manual escalation',
            assigned_to: 'compliance-team',
            status: 'OPEN'
        })

        console.log(`⚠️ Escalated: ${transactionId}`)
    }

    async getPendingReviews(): Promise<any[]> {
        // Simple select without joins
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .in('status', ['PENDING_REVIEW', 'UNDER_REVIEW'])
            .order('created_at', { ascending: true })

        if (error) {
            console.error('Error fetching pending reviews:', error)
            return []
        }

        return data || []
    }

    async getTransactionById(transactionId: string): Promise<any> {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('id', transactionId)
            .single()

        if (error) {
            console.error('Error fetching transaction:', error)
            return null
        }

        return data
    }
}

export const workflowService = new WorkflowService()
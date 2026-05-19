import { NextResponse } from "next/server"
import { workflowService } from "@/lib/services/workflow.service"

export async function GET() {
    try {
        const pending = await workflowService.getPendingReviews()
        return NextResponse.json({ success: true, data: pending, count: pending.length })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

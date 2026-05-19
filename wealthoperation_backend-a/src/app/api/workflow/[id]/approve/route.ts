import { NextRequest, NextResponse } from "next/server"
import { workflowService } from "@/lib/services/workflow.service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await request.json()
        const { userId, comments } = body
        if (!userId) {
            return NextResponse.json({ success: false, error: "userId required" }, { status: 400 })
        }
        await workflowService.approve(params.id, userId, comments)
        return NextResponse.json({ success: true, message: "Transaction approved" })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
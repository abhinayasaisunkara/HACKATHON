# CLAUDE.md

## Project Context
This is a hackathon project for a **Wealth Operations & Compliance Workflow System**. The backend is a Next.js 14 API with Supabase as the database.

## Architecture
- **Framework**: Next.js 14 App Router (API routes only, no frontend pages)
- **Database**: Supabase PostgreSQL
- **Auth**: Custom JWT implementation with bcryptjs for password hashing
- **RBAC**: 4 roles — SUPER_ADMIN, COMPLIANCE_OFFICER, OPERATOR, VIEWER

## Important Files
- `src/app/lib/auth.ts` — JWT generation, verification, password hashing, requireAuth middleware
- `src/app/lib/supabase.ts` — Supabase admin client initialization
- `src/app/lib/audit.ts` — Audit logging utilities
- `src/app/api/` — All API route handlers

## Coding Conventions
- Use TypeScript for all files
- Use `NextRequest` and `NextResponse` from `next/server`
- Use `requireAuth(request)` to protect endpoints
- Check `payload.role` for RBAC enforcement
- Use `supabaseAdmin` for all database operations
- Return JSON responses with `{ success: true, data: ... }` for success
- Return JSON responses with `{ error: "message" }` for errors

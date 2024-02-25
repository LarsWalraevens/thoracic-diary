import { NextRequest, NextResponse } from 'next/server';
import { sql } from "@vercel/postgres";

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        catchUserAuth(request);
        const { rows } = await sql`SELECT * from POSTS ORDER BY id DESC`;
        return NextResponse.json(rows);
    } catch (error) {
        console.error(error);
    }
}

export async function catchUserAuth(request: NextRequest) {
    if (!request.cookies.get("rememberUser") || (request.cookies.get("rememberUser")!.value !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD && request.cookies.get("rememberUser")!.value !== process.env.NEXT_PUBLIC_USER_PASSWORD)) {
        return NextResponse.json({ message: "Access denied", status: 403 }, { status: 403 });
    }
}

export async function catchAdminAuth(request: NextRequest) {
    if (!request.cookies.get("rememberUser") || (request.cookies.get("rememberUser")!.value !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD)) {
        return NextResponse.json({ message: "Access denied", status: 403 }, { status: 403 });
    }
}
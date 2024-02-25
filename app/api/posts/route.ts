import { NextRequest, NextResponse } from 'next/server';
import { sql } from "@vercel/postgres";

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { rows } = await sql`SELECT * from POSTS ORDER BY id DESC`;
        return NextResponse.json(rows);
    } catch (error) {
        console.error(error);
    }
}

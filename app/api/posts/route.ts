import { NextRequest, NextResponse } from 'next/server';
import { sql } from "@vercel/postgres";

export async function GET(request: NextRequest) {
    try {
        const { rows } = await sql`SELECT * from POSTS ORDER BY id DESC`;
        return NextResponse.json(rows, { headers: { 'Cache-Control': 'no-store' } });
    } catch (error) {
        console.error(error);
    }
}

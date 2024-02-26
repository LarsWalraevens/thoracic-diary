import { NextRequest, NextResponse } from 'next/server';
import { sql } from "@vercel/postgres";
import { catchUserAuth } from '@/lib/utils';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        catchUserAuth(request);
        const { rows } = await sql`SELECT * from thoracic_posts ORDER BY id DESC`;
        return NextResponse.json(rows);
    } catch (error) {
        console.error(error);
    }
}
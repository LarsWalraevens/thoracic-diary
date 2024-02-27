import { NextRequest, NextResponse } from 'next/server';
import { sql } from "@vercel/postgres";
import { isUserAuth, sendAccessDenied } from '@/lib/utils';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        if (!await isUserAuth(request)) return sendAccessDenied();
        else {
            const { rows } = await sql`SELECT * from thoracic_posts ORDER BY id DESC`;
            return NextResponse.json(rows);
        }

    } catch (error) {
        console.error(error);
    }
}
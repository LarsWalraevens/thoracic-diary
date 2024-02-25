import { catchAdminAuth } from '@/lib/utils';
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

// Assuming your request body is an object with these properties
interface PostRequestBody {
    id: string;
}

export async function POST(request: NextRequest) {
    try {
        catchAdminAuth(request);
        const requestBody: PostRequestBody = await request.json();

        if (!requestBody.id) {
            return NextResponse.json({ message: "Invalid body, missing required properties" }, { status: 400 });
        }
        const { id } = requestBody;

        const myQuery = sql`DELETE FROM posts WHERE id =${id}`;

        const res = await myQuery;

        return NextResponse.json({ message: "Post removed successfully", data: res });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}

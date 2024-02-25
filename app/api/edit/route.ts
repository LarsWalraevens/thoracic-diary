import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import dayjs from 'dayjs';

// Assuming your request body is an object with these properties
interface PostRequestBody {
    text: string;
    isPrivate?: boolean;
    type: string;
    tags: string;
    id: string;
}

export async function POST(request: NextRequest) {
    try {
        // Parse the request body as JSON
        const requestBody: PostRequestBody = await request.json();

        // Check if required properties are present in the body
        if (!requestBody.text || !requestBody.id || (!requestBody.type || (requestBody.type !== "post" && requestBody.type !== "event"))) {
            return NextResponse.json({ message: "Invalid body, missing required properties" }, { status: 400 });
        }

        // Extract properties from the parsed request body
        const { text, isPrivate, type, tags } = requestBody;

        const date = dayjs().format('YYYY-MM-DD HH:mm:ss');

        // Use template literals directly
        const myQuery = sql`UPDATE posts SET text = ${text}, date = ${date}, isprivate = ${isPrivate || false}, type = ${type}, tags = ${tags} WHERE id = ${requestBody.id}`;

        // Execute the query
        const res = await myQuery;

        return NextResponse.json({ message: "Post edited successfully", data: res });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}

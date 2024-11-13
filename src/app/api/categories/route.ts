import { NextResponse } from "next/server";
import { getAllDocuments, insertDocument } from '@/services/mongo'

export async function GET(request: Request) {
    const data = await getAllDocuments('categories');
    return NextResponse.json(data)
}

export async function POST(request: Request) {
    const body = await request.json();
    const res = await insertDocument('categories', body);
    if (!res)
        if (!res) {
            return NextResponse.json(
                {
                    message: 'Failed to insert category',
                },
                { status: 500 }
            );
        }
    return NextResponse.json({
        ...body, _id: res.insertedId
    }, { status:201})
}

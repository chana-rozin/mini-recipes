import { NextResponse } from "next/server";
import { getAllDocuments , insertDocument } from '@/services/mongo'

export async function GET(request: Request) {
    const data = await getAllDocuments('categories');
    return NextResponse.json({
        data
    })
}

export async function POST(request: Request){
    const body = await request.json();
    const res = await insertDocument('categories', body);
    if(!res)
        return NextResponse.json({
            status: '500',
            message: 'Failed to insert category'
        });
    return NextResponse.json({
        status: '201',
        message: 'Category inserted successfully',
        data: {...body, _id:res.insertedId}
    })
}

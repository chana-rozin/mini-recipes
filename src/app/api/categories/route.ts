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
    const res = await insertDocument('users', body)
    return NextResponse.json({
        res
    })
}

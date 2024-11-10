import { NextResponse } from 'next/server';
import {getAllDocuments, insertDocument} from '@/services/mongo.ts'


export async function GET() {
    
    const res = await getAllDocuments("recipes");
    return NextResponse.json(res);
}

export async function POST(req: Request) {
    const newRecipe = await req.json();
    console.log('POST body', newRecipe)
    const res = await insertDocument("GBooks", newRecipe);
    return NextResponse.json(res);
}

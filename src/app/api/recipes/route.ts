import { NextResponse } from 'next/server';
import { getAllDocuments, insertDocument, getDocumentByCategory } from '@/services/mongo.ts'


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url); // Create a URL object from req.url
    const categoryName = searchParams.get('category');
    let res: any;
    console.log(categoryName);
    if(categoryName)
        res = await getDocumentByCategory("recipes", categoryName);
    else
        res = await getAllDocuments("recipes");
    return NextResponse.json(res);
}

export async function POST(req: Request) {
    const newRecipe = await req.json();
    console.log('POST body', newRecipe)
    const res = await insertDocument("recipes", newRecipe);
    return NextResponse.json(res);
}

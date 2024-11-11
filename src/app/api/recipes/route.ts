import { NextResponse } from 'next/server';
import { getAllDocuments, insertDocument, getFilteredDocuments } from '@/services/mongo';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    let categories:string[]|string|null= searchParams.get('category');
    categories = categories===""?null:categories?.split(',')||null;
    const page = searchParams.get('page');
    const pageSize = searchParams.get('pageSize');
    const pageInt = page ? parseInt(page, 10) : undefined;
    const pageSizeInt = pageSize ? parseInt(pageSize, 10) : undefined;
    let res: any;
    
    res = await getFilteredDocuments("recipes", categories, pageInt, pageSizeInt, search);
    return NextResponse.json(res);
}

export async function POST(req: Request) {
    const newRecipe = await req.json();
    console.log('POST body', newRecipe);
    const res = await insertDocument("recipes", newRecipe);
    return NextResponse.json(res);
}

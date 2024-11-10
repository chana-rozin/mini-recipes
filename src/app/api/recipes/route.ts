import { NextResponse } from 'next/server';
import { getAllDocuments, insertDocument, getDocumentByCategory } from '@/services/mongo';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const categoryName = searchParams.get('category');
    const page = searchParams.get('page');
    const pageSize = searchParams.get('pageSize');
    const pageInt = page ? parseInt(page, 10) : undefined;
    const pageSizeInt = pageSize ? parseInt(pageSize, 10) : undefined;

    let res: any;

    if (categoryName)
        res = await getDocumentByCategory("recipes", categoryName, pageInt, pageSizeInt);
    else
        res = await getAllDocuments("recipes", pageInt, pageSizeInt);

    return NextResponse.json(res);
}

export async function POST(req: Request) {
    const newRecipe = await req.json();
    console.log('POST body', newRecipe);
    const res = await insertDocument("recipes", newRecipe);
    return NextResponse.json(res);
}

import { NextResponse } from "next/server";
import { updateDocument, deleteDocument, getDocumentById } from "@/services/mongo";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }>}) {
    const body = await request.json();
    let { id } = await params;
    delete body._id;
    const res = await updateDocument( 'recipes', id, body);
    if(res){
        return new NextResponse(
            body,
            { status: 200 }
        );
    }
    return new NextResponse(
        "Faild to update",
        { status: 500 }
    );
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }>}) {
    const { id } = await params;
    const res = await deleteDocument('recipes', id );
    if(res){
        return new NextResponse(
            "Document deleted",
            { status: 200 }
        );
    }
    return new NextResponse(
        "Faild to delete",
        { status: 500 }
    );
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }  // Wrap params in Promise
) {
    const { id } = await params;  // Await params here since it's a Promise
    const res = await getDocumentById('recipes', id );
    return NextResponse.json(res);
}



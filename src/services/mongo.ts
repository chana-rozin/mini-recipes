import { MongoClient, ObjectId } from "mongodb";


let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const DB = process.env.MONGO_DB;

export async function connectDatabase() {
    if (!clientPromise) {
        const dbConnectionString = process.env.PUBLIC_DB_CONNECTION;
        if (!dbConnectionString) 
            throw new Error('Database connection string is not defined');
        client = new MongoClient(dbConnectionString);
        clientPromise = client.connect();
    }
    
    const connectedClient = await clientPromise;
    return connectedClient;
}

export async function insertDocument(collection: string, document: object) {
    const client = await connectDatabase();
    const db = client.db(DB);
    const result = await db.collection(collection).insertOne(document);
    return result;
}

export async function deleteDocument(collection: string, id: string){
    const client = await connectDatabase();
    const db = client.db(DB);
    const result = await db.collection(collection).deleteOne({_id: new ObjectId(id)});
    return result.deletedCount > 0;
}

export async function updateDocument(collection: string, id: string, updatedDocument: object) {
    const client = await connectDatabase();
    const db = client.db(DB);
    const result = await db.collection(collection).updateOne({_id: new ObjectId(id)}, {$set: updatedDocument});
    return result.matchedCount > 0;
}

export async function getFilteredDocuments(collection: string, category?: string[] | null, page?: number, pageSize?: number, search?: string | null) {
    const client = await connectDatabase();
    const db = client.db(DB);
    
    const skip = page ? (page - 1) * pageSize! : 0;  // Skip if page is provided
    const limit = pageSize || 0; // Limit if pageSize is provided
    
    const totalCount = await db.collection(collection).countDocuments({ category: { $in: [category] } });
    const query: {
        category?: { $all: string[] },
        $or?: Array<{ instructions?: { $regex: string, $options: string } } | { mealName?: { $regex: string, $options: string } }>
    }={};
    if(category){
        query.category = { $all: category };
    }
    // Add the search condition only if searchString is not null or empty
    if (search) {
        query.$or = [
            { instructions: { $regex: search, $options: 'i' } },
            { mealName: { $regex: search, $options: 'i' } }
        ];
    }
    
    const documents = await db.collection(collection)
        .find(query)
        .skip(skip)
        .limit(limit)
        .toArray();

    return documents;
}

export async function getAllDocuments(collection: string, page?: number, pageSize?: number) {
    const client = await connectDatabase();
    const db = client.db(DB);

    const skip = page ? (page - 1) * pageSize! : 0;
    const limit = pageSize || 0;

    const documents = await db.collection(collection)
        .find()
        .skip(skip)
        .limit(limit)
        .toArray();

    return documents;
}

export async function getDocumentById(collection: string, id: string) {
    const client = await connectDatabase();
    const db = client.db(DB);
    const document = await db.collection(collection).findOne({ _id: new ObjectId(id)});    
    return document;
}
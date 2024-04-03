import { MongoClient, Db } from "mongodb";

export default class DatabaseInterface
{
    private client: MongoClient;
    private db: Db | undefined;
    
    constructor(private host: string, private port: number, private database: string, private username: string, private password: string)
    {
        if(!this.username || !this.password)
            this.client = new MongoClient(`mongodb://${this.host}:${this.port}`);
        else
            this.client = new MongoClient(`mongodb://${this.username}:${this.password}@${this.host}:${this.port}`);
    }

    async connect()
    {
        await this.client.connect();
        this.db = this.client.db(this.database);
        
        return this; // chain-link functions support: db.connect().getCollection(...);
    }

    isConnected()
    {
        return this.db == undefined;
    }

    async getCollection(collection: string)
    {
        return this.db?.collection(collection);
    }

    async getDocument(collection: string, query: any)
    {
        let result = await this.db?.collection(collection).find(query).toArray();
        if (!result)
            return;
        if (result.length == 0)
            return null;
        return result[0];
    }

    async getDocuments(collection: string, query: any)
    {
        return await this.db?.collection(collection).find(query).toArray();
    }

    async getDocumentsSkip(collection: string, query: any, skip: number, limit: number)
    {
        if (!limit)
            limit = 1;
        if (!skip)
            skip = 0;

        let result = await this.db?.collection(collection).find(query).limit(limit).skip(skip).toArray();
        return result;
    }

    async checkDocumentExists(collection: string, query: any)
    {
        let result = await this.db?.collection(collection).find(query).toArray();
        if (!result) return;

        return result.length > 0;
    }

    async insertDocument(collection: string, document: any)
    {
        await this.db?.collection(collection).insertOne(document);
    }

    async deleteDocument(collection: string, query: any)
    {
        await this.db?.collection(collection).deleteOne(query);
    }

    async deleteDocuments(collection: string, query: any)
    {
        await this.db?.collection(collection).deleteMany(query);
    }

    async updateDocument(collection: string, query: any, update: any)
    {
        let _collection = await this.getCollection(collection);
        if (!_collection) return;
        
        let result = await _collection.updateOne(query, update);
        return result;
    }
}
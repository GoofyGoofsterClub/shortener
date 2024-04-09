import DatabaseInterface from "@db/database";

export default abstract class DefaultRoute
{
    public databaseInterface: DatabaseInterface;
    public readonly abstract Method: string;
    public readonly abstract Path: string;
    public abstract Serve(request: any, response: any): void;

    constructor(db: DatabaseInterface)
    {
        this.databaseInterface = db;
    }
}

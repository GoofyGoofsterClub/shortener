import DatabaseInterface from "@db/database";
import { APIResponse } from "./apiresponse";

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

export abstract class DefaultAPIRoute
{
    public databaseInterface: DatabaseInterface;
    public readonly abstract Method: string;
    public abstract Serve(request: any, response: any): void;

    constructor(db: DatabaseInterface)
    {
        this.databaseInterface = db;
    }

    respond(_response: any, response: APIResponse)
    {
        return _response.send(response);
    }

    async authenticate(request: any): Promise<boolean>
    {
        if (!request.query.key)
            return false;
        
        let doesUserExist = await this.databaseInterface.checkDocumentExists("users", { "key": `${request.query.key}` });
        return doesUserExist ?? false;
    }
}

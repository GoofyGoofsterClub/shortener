import { Server } from "@web/server";
import DatabaseInterface from "@db/database";

(async () => {
    
    const server: Server = new Server();
    const database: DatabaseInterface = new DatabaseInterface(process.env.MONGO_HOST as string,
        parseInt(process.env.MONGO_PORT as string),
        process.env.MONGO_DB as string,
        process.env.MONGO_USER as string,
        process.env.MONGO_PASSWORD as string);
    await database.connect();
    
    server.start();

})().catch(console.error);
import { DefaultAPIRoute } from "@web/route";
import { APIResponse } from "@web/apiresponse";

export default class extends DefaultAPIRoute
{
    public readonly Method: string = "GET";

    public async Serve(request: any, response: any): Promise<void>
    {
        if (!request.query.key)
        {
            response.status(400);
            return this.respond(response,
            {
                "status": response.statusCode,
                "message": "USER_ERROR",
                "data": []
            });
        }
        
        let doesUserExist = await this.databaseInterface.checkDocumentExists("users", { "key": request.query.key });
        response.status(doesUserExist ? 200 : 401);

        this.respond(response,
            {
                "status": response.statusCode,
                "message": "USER_EXISTANCE_CHECK",
                "data": {
                    "success": doesUserExist
                }
            });
    }
}
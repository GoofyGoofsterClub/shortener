import { DefaultAPIRoute } from "@web/route";

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
        
        let userInfo = await this.databaseInterface.getDocument("users", { "key": request.query.key });
        response.status(userInfo ? 200 : 401);

        this.respond(response,
            {
                "status": response.statusCode,
                "message": "USER_EXISTANCE_CHECK",
                "data": {
                    "success": userInfo ? true : false,
                    "user": userInfo
                }
            });
    }
}
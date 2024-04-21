import { GeneratePrivateID, GeneratePublicID } from "@utils/id";
import { parseBoolean } from "@utils/boolean";
import { DefaultAPIRoute } from "@web/route";

export default class extends DefaultAPIRoute
{
    public readonly Method: string = "GET";

    public async Serve(request: any, response: any): Promise<void>
    {
        if (!this.authenticate(request))
        {
            response.status(401);
            this.respond(response, {
                "status": response.statusCode,
                "message": "USER_AUTH_FAIL",
                "data": []
            });
            return;
        }

        if (!request.query.link)
        {
            response.status(400);
            this.respond(response, {
                "status": response.statusCode,
                "message": "PARAMS_FAILURE",
                "data": []
            });
            return;
        }

        let linkToShorten: string = request.query.link;
        let privateID: string = GeneratePublicID(9);
        let destroyAfterUse: boolean = parseBoolean(request.query.onetime) ?? false;
        let sameDomainOnly: boolean = parseBoolean(request.query.samedomain) ?? false;
        
        let userInfo = await this.databaseInterface.getDocument("users", { "key": request.query.key });
        if (!userInfo)
        {
            response.status(401);
            this.respond(response, {
                "status": response.statusCode,
                "message": "USER_AUTH_FAIL",
                "data": []
            });
            return;
        }

        await this.databaseInterface.insertDocument("links", {
            "pseudoLink": privateID,
            "originalLink": linkToShorten,
            "oneTime": destroyAfterUse,
            "sameDomainOnly": sameDomainOnly,
            "destructionId": GeneratePrivateID(21),
            "createdBy": userInfo.displayName,
            "createdOn": request.get('host'),
            "views": 0,
            "creationTime": +Date.now()
        });

        this.respond(response,
            {
                "status": response.statusCode,
                "message": "URL_SHORTENED",
                "data": {
                    "success": true,
                    "link": `https://${request.get('host')}/${privateID}`
                }
            });
    }
}
import { DefaultAPIRoute } from "@web/route";
import { APIResponse } from "@web/apiresponse";

export default class extends DefaultAPIRoute
{
    public readonly Method: string = "GET";

    public Serve(request: any, response: any): void
    {
        this.respond(response, {
            "status": response.statusCode,
            "message": "",
            "data": []

        } as APIResponse);
    }
}
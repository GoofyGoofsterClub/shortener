import { DefaultAPIRoute } from "@web/route";

export default class extends DefaultAPIRoute
{
    public readonly Method: string = "GET";

    public Serve(request: any, response: any): void
    {
        response.send({
            "callback": true
        });
    }
}
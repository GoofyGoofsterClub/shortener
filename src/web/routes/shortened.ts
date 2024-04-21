import DefaultRoute from "@web/route";

export default class ShortenedLinkRoute extends DefaultRoute
{
    public readonly Method: string = "GET";
    public readonly Path: string = "/:linkID";

    public async Serve(request: any, response: any): Promise<void>
    {
        let linksMatching = await this.databaseInterface.getDocument("links", { "pseudoLink": request.params.linkID });
        if (!linksMatching || linksMatching.used)
        {
            response.send();
            return;
        }

        if (linksMatching.sameDomainOnly && request.get('host') != linksMatching.createdOn)
        {
            response.send();
            return;
        }

        if (linksMatching.oneTime)
            await this.databaseInterface.updateDocument("links", { "pseudoLink": request.params.linkID }, { "$set": { "used": true } });
        
        await this.databaseInterface.updateDocument("links", { "pseudoLink": request.params.linkID }, { "$inc": { "views": 1 }});

        response.redirect(linksMatching.originalLink);
    }
}
export class CrawlerService {
    public async getSite(url: string) {
        const response = await superagent
            .get(url)
            // .set('X-API-Key', 'foobar')
            // .set('accept', 'json')
            .end((error: any, response: any) => {
                console.log({
                    error, response
                });
            });

        // todo process the data
    }
}

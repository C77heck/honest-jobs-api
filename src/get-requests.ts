import superagent from "superagent";
import { ChromiumService } from './modules/crawler/services/chromium.service';

class RunRequests {
    private chromium: ChromiumService;
    private base64: string = "aHR0cDovL3d3dy5pbmNlc3RmbGl4LmNvbS8=";
    // todo refresh page and collect all items
    // todo save the titles and urls.
    // todo create frontend that filters with an input to get back results.

    // public constructor() {
    //     this.chromium = ChromiumService.instance as ChromiumService;
    // }

    private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

    public async run() {
        return this.runAgent();
    }

    private getUrl() {
        return Buffer.from(this.base64, 'base64').toString('utf-8');
    }

    private async runChromium() {
        await this.chromium.boot();
        console.log('starting ');
        const html = await this.chromium.fetchPageHtml(this.getUrl());
        console.log({ html });

        return html;
    }

    private async runAgent() {
        try {
            return superagent
                .get(this.getUrl())
                .withCredentials()
                .set('User-Agent', this.userAgent)
                .send();
        } catch (e) {
            console.log(e);
        }
    }
}

const requests = new RunRequests();
requests.run().then((d) => console.log(d)).catch(e => console.log(e));

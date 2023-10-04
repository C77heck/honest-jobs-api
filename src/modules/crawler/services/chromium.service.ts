import * as puppeteer from 'puppeteer';
import { NotFound } from '../../../application/models/errors';
import { Provider } from '../../../application/provider';
import { CONSTANTS } from '../../../libs/constants';
import { sleep } from '../../../libs/helpers';

export interface LiveBrowser {
    browser: puppeteer.Browser;
    id: number;
    status: "ready" | "busy";
}

export class ChromiumService extends Provider {
    private browsers: LiveBrowser[] = [];

    public async boot() {
        for (const id of [1, 2, 3, 4, 5, 6]) {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox'],
            });

            this.browsers.push({ browser, id, status: "ready" });
        }
    }

    private getAvailableBrowser() {
        const availableBrowser = this.browsers.find(br => br.status === "ready");

        if (!availableBrowser) {
            throw new NotFound("All browser process re busy");
        }

        return availableBrowser;
    }

    private async process(liveBrowser: LiveBrowser, url: string) {
        try {
            liveBrowser.status = "busy";
            const page = await liveBrowser.browser.newPage();
            await page.setUserAgent(CONSTANTS.userAgent);
            await page.goto(url, { timeout: 60000 });
            const htmlContent = await page.content();
            liveBrowser.status = "ready";

            return htmlContent;
        } catch (e) {
            return e as string;
        }
    }

    public async fetchPageHtml(url: string): Promise<any> {
        try {
            const availableBrowser = this.getAvailableBrowser();
            return this.process(availableBrowser, url);
        } catch (e) {
            await sleep(2000);
            return this.fetchPageHtml(url);
        }
    }
}

import os from 'os';
import fs from 'fs';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import genericPool from 'generic-pool';

import type { Browser, CookieParam, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';

import puppeteerBlockResources from 'puppeteer-extra-plugin-block-resources';
import puppeteerPageProxy from 'puppeteer-extra-plugin-page-proxy';
import puppeteerStealth from 'puppeteer-extra-plugin-stealth';

import { Defer, delay } from '../utils';

const READABILITY_JS = fs.readFileSync(
  require.resolve('@mozilla/readability/Readability.js'),
  'utf-8',
);

export interface ImgBrief {
  src: string;
  loaded: boolean;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
  alt?: string;
}

export interface ReadabilityParsed {
  title: string;
  content: string;
  textContent: string;
  length: number;
  excerpt: string;
  byline: string;
  dir: string;
  siteName: string;
  lang: string;
  publishedTime: string;
}

export interface PageSnapshot {
  title: string;
  href: string;
  html: string;
  parsed?: Partial<ReadabilityParsed> | null;
  screenshot?: Buffer;
  imgs?: ImgBrief[];
}

export interface ScrappingOptions {
  proxyUrl?: string;
  cookies?: CookieParam[];
  favorScreenshot?: boolean;
}

puppeteer.use(puppeteerStealth());

puppeteer.use(
  puppeteerBlockResources({
    blockedTypes: new Set(['media']),
    interceptResolutionPriority: 1,
  }),
);
puppeteer.use(
  puppeteerPageProxy({
    interceptResolutionPriority: 1,
  }),
);

@Injectable()
export class PuppeteerService implements OnModuleInit {
  private readonly logger = new Logger(PuppeteerService.name);

  private browser!: Browser;

  private pagePool = genericPool.createPool(
    {
      create: async () => {
        const page = await this.newPage();
        return page;
      },
      destroy: async (page) => {
        await Promise.race([
          (async () => {
            const ctx = page.browserContext();
            await page.removeExposedFunction('reportSnapshot');
            await page.close();
            await ctx.close();
          })(),
          delay(5000),
        ]).catch((err) => {
          this.logger.error(`Failed to destroy page: ${err}`);
        });
      },
      validate: async (page) => {
        return page.browser().connected && !page.isClosed();
      },
    },
    {
      max: 16,
      min: 1,
      acquireTimeoutMillis: 60_000,
      testOnBorrow: true,
      testOnReturn: true,
      autostart: false,
      priorityRange: 3,
    },
  );

  private __healthCheckInterval?: NodeJS.Timeout;

  async onModuleInit() {
    if (this.__healthCheckInterval) {
      clearInterval(this.__healthCheckInterval);
      this.__healthCheckInterval = undefined;
    }
    this.logger.log(`PuppeteerService initializing with pool size ${this.pagePool.max}`);
    this.pagePool.start();

    if (this.browser) {
      if (this.browser.connected) {
        await this.browser.close();
      } else {
        this.browser.process()?.kill('SIGKILL');
      }
    }

    this.browser = await puppeteer
      .launch({
        timeout: 10_000,
      })
      .catch((err: any) => {
        this.logger.error(`launch browser failed: ${err}, just die fast.`);
        return Promise.reject(err);
      });
    this.browser.once('disconnected', () => {
      this.logger.warn(`Browser disconnected`);
    });
    this.logger.log(`Browser launched: ${this.browser.process()?.pid}`);

    this.__healthCheckInterval = setInterval(() => this.healthCheck(), 30_000);
  }

  async healthCheck() {
    const healthyPage = await Promise.race([
      this.pagePool.acquire(3),
      delay(60_000).then(() => null),
    ]).catch((err) => {
      this.logger.error(`Health check failed: ${err}`);
      return null;
    });

    if (healthyPage) {
      this.pagePool.release(healthyPage);
      return;
    }

    this.logger.warn(`Health check failed, trying to clean up.`);
    await this.pagePool.clear();
    this.browser.process()?.kill('SIGKILL');
    Reflect.deleteProperty(this, 'browser');
  }

  async newPage() {
    const dedicatedContext = await this.browser.createBrowserContext();

    const page = await dedicatedContext.newPage();
    const preparations = [];

    // preparations.push(page.setUserAgent(`Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)`));
    // preparations.push(page.setUserAgent(`Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.0; +https://openai.com/gptbot)`));
    preparations.push(page.setBypassCSP(true));
    preparations.push(page.setViewport({ width: 1024, height: 1024 }));
    preparations.push(
      page.exposeFunction('reportSnapshot', (snapshot: PageSnapshot) => {
        if (snapshot.href === 'about:blank') {
          return;
        }
        page.emit('snapshot', snapshot);
      }),
    );
    preparations.push(page.evaluateOnNewDocument(READABILITY_JS));
    preparations.push(
      page.evaluateOnNewDocument(`
function briefImgs(elem) {
    const imageTags = Array.from((elem || document).querySelectorAll('img[src]'));

    return imageTags.map((x)=> ({
        src: x.src,
        loaded: x.complete,
        width: x.width,
        height: x.height,
        naturalWidth: x.naturalWidth,
        naturalHeight: x.naturalHeight,
        alt: x.alt || x.title,
    }));
}
function giveSnapshot() {
    let parsed;
    try {
        parsed = new Readability(document.cloneNode(true)).parse();
    } catch (err) {
        void 0;
    }

    const r = {
        title: document.title,
        href: document.location.href,
        html: document.documentElement.outerHTML,
        text: document.body.innerText,
        parsed: parsed,
        imgs: [],
    };
    if (parsed && parsed.content) {
        const elem = document.createElement('div');
        elem.innerHTML = parsed.content;
        r.imgs = briefImgs(elem);
    } else {
        const allImgs = briefImgs();
        if (allImgs.length === 1) {
            r.imgs = allImgs;
        }
    }

    return r;
}
`),
    );
    preparations.push(
      page.evaluateOnNewDocument(`
let aftershot = undefined;
const handlePageLoad = () => {
    if (document.readyState !== 'complete') {
        return;
    }
    const parsed = giveSnapshot();
    window.reportSnapshot(parsed);
    if (!parsed.text) {
        if (aftershot) {
            clearTimeout(aftershot);
        }
        aftershot = setTimeout(() => {
            const r = giveSnapshot();
            if (r && r.text) {
                window.reportSnapshot(r);
            }
        }, 500);
    }
};
document.addEventListener('readystatechange', handlePageLoad);
document.addEventListener('load', handlePageLoad);
`),
    );
    await Promise.all(preparations);

    // TODO: further setup the page;

    return page;
  }

  async *scrap(
    parsedUrl: URL,
    options: ScrappingOptions,
  ): AsyncGenerator<PageSnapshot | undefined> {
    // parsedUrl.search = '';
    const url = parsedUrl.toString();

    this.logger.log(`Scraping ${url}`);

    let snapshot: PageSnapshot | undefined;
    let screenshot: Buffer | undefined;

    const page = await this.pagePool.acquire();
    if (options.proxyUrl) {
      await page.useProxy(options.proxyUrl);
    }
    if (options.cookies) {
      await page.setCookie(...options.cookies);
    }

    let nextSnapshotDeferred = Defer();
    let finalized = false;
    const hdl = (s: any) => {
      if (snapshot === s) {
        return;
      }
      snapshot = s;
      nextSnapshotDeferred.resolve(s);
      nextSnapshotDeferred = Defer();
    };
    page.on('snapshot', hdl);

    const gotoPromise = page
      .goto(url, { waitUntil: ['load', 'domcontentloaded', 'networkidle0'], timeout: 10_000 })
      .catch((err) => {
        this.logger.warn(`Browsing of ${url} did not fully succeed: ${err}`);
      })
      .finally(async () => {
        if (!snapshot?.html) {
          finalized = true;
          return;
        }
        snapshot = (await page.evaluate('giveSnapshot()')) as PageSnapshot;
        screenshot = await page.screenshot();
        if (!snapshot.title || !snapshot.parsed?.content) {
          const salvaged = await this.salvage(url, page);
          if (salvaged) {
            snapshot = (await page.evaluate('giveSnapshot()')) as PageSnapshot;
            screenshot = await page.screenshot();
          }
        }
        finalized = true;
        this.logger.log(
          `Snapshot of ${url} done: ` +
            JSON.stringify({
              url,
              title: snapshot?.title,
              href: snapshot?.href,
            }),
        );
      });

    try {
      let lastHTML = snapshot?.html;
      while (true) {
        await Promise.race([nextSnapshotDeferred.promise, gotoPromise]);
        if (finalized) {
          yield { ...snapshot, screenshot } as PageSnapshot;
          break;
        }
        if (options.favorScreenshot && snapshot?.title && snapshot?.html !== lastHTML) {
          screenshot = await page.screenshot();
          lastHTML = snapshot.html;
        }
        if (snapshot || screenshot) {
          yield { ...snapshot, screenshot } as PageSnapshot;
        }
      }
    } finally {
      gotoPromise.finally(() => {
        page.off('snapshot', hdl);
        this.pagePool.destroy(page).catch((err) => {
          this.logger.warn(`Failed to destroy page: ${err}`);
        });
      });
    }
  }

  async salvage(url: string, page: Page) {
    this.logger.log(`Salvaging ${url}`);
    const googleArchiveUrl = `https://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(
      url,
    )}`;
    const resp = await fetch(googleArchiveUrl, {
      headers: {
        'User-Agent': `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.0; +https://openai.com/gptbot)`,
      },
    });
    resp.body?.cancel().catch(() => void 0);
    if (!resp.ok) {
      this.logger.warn(`No salvation found for url: ${url}`, { status: resp.status, url });
      return null;
    }

    await page
      .goto(googleArchiveUrl, {
        waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
        timeout: 15_000,
      })
      .catch((err) => {
        this.logger.error(`Page salvation did not fully succeed: ` + err);
      });

    this.logger.log(`Salvation completed.`);

    return true;
  }
}

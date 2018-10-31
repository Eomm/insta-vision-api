'use strict';

const puppeteer = require('puppeteer');

function wait(sec) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

class InstagramNavigator {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async openBrowser(headless = true, args = []) {
    this.browser = await puppeteer.launch({
      headless,
      args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox', ...args],
      defaultViewport: { width: 768, height: 1024 },
    });
  }

  async openPage() {
    this.page = await this.browser.newPage();
    this.page.setDefaultNavigationTimeout(60000);
    const userAgent = await this.browser.userAgent();
    this.page.setUserAgent(userAgent.replace('Headless', ''));
  }

  async login(user, password) {
    await this.page.goto('https://www.instagram.com/accounts/login/');
    await this.page.waitForSelector('input[name=\'username\']');
    await this.page.type('input[name=\'username\']', user, { delay: 100 });

    await this.page.waitForSelector('input[name=\'password\']');
    await this.page.type('input[name=\'password\']', password, { delay: 100 });
    await this.page.waitForSelector('form > div:nth-child(3) > button');
    const btnLogin = await this.page.$('form > div:nth-child(3) > button');
    await btnLogin.click();
    console.log('Logging...');
    await wait(3);
  }

  async readFollowedProfiles(searchUser) {
    await wait(1);
    await this.page.goto(`https://www.instagram.com/${searchUser}/`);
    await wait(5);
    await this.page.waitForSelector('main > div > header > section > ul > li:nth-child(3) > a');
    const openFollowed = await this.page.$('main > div > header > section > ul > li:nth-child(3) > a');
    await openFollowed.click();
    console.log('Opening followed...');

    // FIX: when open followed, sometimes a list of suggestion is open instead

    await wait(6);
    const scrollDown = (selector) => {
      const scrollableSection = document.querySelector(selector);
      // TODO if scrollableSection is null
      scrollableSection.scrollTop = scrollableSection.scrollHeight;
    };

    const popupSelector = 'body > div:nth-child(15) > div > div > div.isgrP';
    const profilesSelector = 'body > div:nth-child(15) > div > div > div.isgrP > ul > div > li > div > div.t2ksc > div.enpQJ > div.d7ByH > a';

    let infinityScrolling = -1;
    let profilesFollowed = [];
    let retry = 3;
    try {
      while (infinityScrolling !== profilesFollowed.length || retry > 0) {
        infinityScrolling = profilesFollowed.length;
        await wait(1);
        await this.page.waitForSelector(popupSelector);
        await this.page.evaluate(scrollDown, popupSelector);
        await this.page.screenshot({ path: `screen_${infinityScrolling}.png` });
        await this.page.waitForSelector(profilesSelector);
        profilesFollowed = await this.page.$$eval(profilesSelector, links => links.map(a => a.title));
        console.log('Scrolling...', infinityScrolling);

        if (infinityScrolling === profilesFollowed.length) {
          retry -= 1;
        }
      }
    } catch (err) {
      console.error(err);
    }
    return profilesFollowed;
  }

  async readStories(searchUser) {
    await wait(1);
    await this.page.goto(`https://www.instagram.com/stories/${searchUser}/`);
    await wait(2);

    const storiesNum = await this.page.evaluate(() => {
      return document.getElementsByClassName('-Nmqg').length;
    })

    console.log(`There are ${storiesNum} for ${searchUser}`);

    for (let i = 0; i < storiesNum; i++) {
      console.log('screnshotting', i);
      await wait(2);
      await this.page.screenshot({ path: `stories-${searchUser}-${i}.png` });
      await this.page.click('#react-root > section > div > div > section > div.GHEPc > button.ow3u_ > div');
    }
  }

  close() {
    this.page.close();
    this.browser.close();
  }
}

module.exports = InstagramNavigator

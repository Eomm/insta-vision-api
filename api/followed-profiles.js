'use strict';

const puppeteer = require('puppeteer');

function wait(sec) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

async function followed(user, password) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-gpu', '--no-sandbox', '--window-size=1024x768'],
    defaultViewport: { width: 1024, height: 768 },
  });

  const page = await browser.newPage();
  const userAgent = await browser.userAgent();
  console.log(userAgent);

  page.setUserAgent(userAgent.replace('Headless', ''));

  await page.goto('https://www.instagram.com/accounts/login/');
  await page.waitForSelector('input[name=\'username\']');
  await page.type('input[name=\'username\']', user, { delay: 100 });

  await page.waitForSelector('input[name=\'password\']');
  await page.type('input[name=\'password\']', password, { delay: 100 });
  await page.waitForSelector('form > div:nth-child(3) > button');
  const btnLogin = await page.$('form > div:nth-child(3) > button');
  await btnLogin.click();
  console.log('clicked');

  // const html = await page.content();
  // const cookies = await page.cookies();
  // console.log('html', html);
  // console.log('cookies', cookies);

  await wait(8);

  await page.goto(`https://www.instagram.com/${user}/`);
  await wait(3);
  await page.waitForSelector('main > div > header > section > ul > li:nth-child(3) > a');
  const openFollowed = await page.$('main > div > header > section > ul > li:nth-child(3) > a');
  await openFollowed.click();
  console.log('clicked');

  await wait(6);

  const scrollDown = (selector) => {
    const scrollableSection = document.querySelector(selector);
    scrollableSection.scrollTop = scrollableSection.offsetHeight;
  };

  // TODO scrool
  await wait(2);
  await page.evaluate(scrollDown, 'body > div:nth-child(15) > div > div > div.isgrP');
  await wait(2);
  await page.evaluate(scrollDown, 'body > div:nth-child(15) > div > div > div.isgrP');

  await page.waitForSelector('body > div:nth-child(15) > div > div > div.isgrP > ul > div > li > div > div.t2ksc > div.enpQJ > div.d7ByH > a');

  const profilesFollowed = await page.$$eval('body > div:nth-child(15) > div > div > div.isgrP > ul > div > li > div > div.t2ksc > div.enpQJ > div.d7ByH > a',
    a => a.map((_) => {
      console.log(_);
      return _.title;
    }));
  console.log(profilesFollowed);


  await browser.close();
}


followed('xxx', 'xxx')
  .catch(console.error);

module.exports = followed;

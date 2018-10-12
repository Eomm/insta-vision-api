'use strict';

const puppeteer = require('puppeteer');

function wait(sec) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

async function followed(user, password, searchUser = user) {
  const browser = await puppeteer.launch({
    headless: true,
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

  await wait(2);
  await page.goto(`https://www.instagram.com/${searchUser}/`);
  await wait(4);
  await page.waitForSelector('main > div > header > section > ul > li:nth-child(3) > a');
  const openFollowed = await page.$('main > div > header > section > ul > li:nth-child(3) > a');
  await openFollowed.click();
  console.log('clicked');

  await wait(6);

  const scrollDown = (selector) => {
    const scrollableSection = document.querySelector(selector);
    scrollableSection.scrollTop = scrollableSection.scrollHeight;
  };

  const profilesSelector = 'body > div:nth-child(15) > div > div > div.isgrP > ul > div > li > div > div.t2ksc > div.enpQJ > div.d7ByH > a';

  let infinityScrolling = -1;
  let profilesFollowed = [];
  let retry = 3;
  while (infinityScrolling !== profilesFollowed.length || retry > 0) {
    infinityScrolling = profilesFollowed.length;
    await wait(1);
    await page.evaluate(scrollDown, 'body > div:nth-child(15) > div > div > div.isgrP');
    await page.waitForSelector(profilesSelector);
    profilesFollowed = await page.$$eval(profilesSelector, links => links.map(a => a.title));
    console.log({ infinityScrolling });

    if (infinityScrolling === profilesFollowed.length) {
      retry--;
    }
  }

  await browser.close();
  return profilesFollowed;
}


followed('xxx', 'yyy', 'zzz')
  .then(profiles => console.log(profiles.length))
  .catch(console.error);

module.exports = followed;

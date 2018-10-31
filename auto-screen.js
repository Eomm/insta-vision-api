'use strict';

require('dotenv').config();
const InstagramNavigator = require('./api/utils/InstagramNavigator')


const instagram = {
  user: process.env.INSTAGRAM_USER,
  password: process.env.INSTAGRAM_PASSWORD,
};

async function screenshootOnUsers(users) {
  const navigate = new InstagramNavigator()
  await navigate.openBrowser(false)
  await navigate.openPage()
  await navigate.login(instagram.user, instagram.password)

  for (const user of users) {
    await navigate.readStories(user);
  }

  await navigate.close();
}


screenshootOnUsers(['vagheggi.albania', 'gianst3'])
  .then(() => console.log('end'))
  .catch(console.error);


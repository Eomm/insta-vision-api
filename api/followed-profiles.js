'use strict';

const InstagramNavigator = require('./utils/InstagramNavigator')

const instagram = {
  user: process.env.INSTAGRAM_USER,
  password: process.env.INSTAGRAM_PASSWORD,
};

async function followed(user, password, searchUser = user) {
  const navigate = new InstagramNavigator()
  await navigate.openBrowser(false)
  await navigate.openPage()
  await navigate.login(user, password)

  // Test!
  await navigate.readStories(searchUser);

  return navigate.readFollowedProfiles(searchUser)
}

async function followedProfiles(fastify, options) {
  fastify.get('/followed-profiles/:profile', async (request, reply) => {
    try {
      const { profile } = request.params;
      const profiles = await followed(instagram.user, instagram.password, profile);
      console.log(`Profiles found for ${profile}`, profiles);
      reply.send(profiles);
    } catch (error) {
      reply.send(error);
    }
  });
}

module.exports = followedProfiles;

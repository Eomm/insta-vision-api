'use strict';

const ipp = require('instagram-profile-picture');

async function profilePicture(fastify, options) {
  fastify.get('/profile-picture/:profile', async (request, reply) => {
    try {
      const { profile } = request.params;
      const url = await ipp(profile);
      console.log(`Found ${profile} image URL: ${url}`);
      reply.send(url);
    } catch (error) {
      reply.send(error);
    }
  });
}

module.exports = profilePicture;

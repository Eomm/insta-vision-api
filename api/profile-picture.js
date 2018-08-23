'use strict';

const ipp = require('instagram-profile-picture');

async function profilePicture(fastify, options) {
  fastify.get('/profile-picture', async (request, reply) => {
    ipp('9gag').then((user) => {
      console.log(user);
      reply.send(user);
      // => https://scontent-sit4-1.cdninstagram.com/7...jpg
    }).catch(err => reply.send(err));
  });
}

module.exports = profilePicture;

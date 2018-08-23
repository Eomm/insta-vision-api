'use strict';

async function hello(fastify) {
  fastify.get('/', async () => ({ hello: 'world' }));
}

module.exports = hello;

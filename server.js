'use strict';

require('dotenv').config();
const fastify = require('fastify')({ logger: true });


fastify.register(require('./api/ping'));
fastify.register(require('./api/vision'));


fastify.listen(process.env.PORT, '0.0.0.0', (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`)
});
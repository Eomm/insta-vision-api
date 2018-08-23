'use strict';

const vision = require('@google-cloud/vision');

const credentials = {
  projectId: process.env.GOOGLE_PROJECTID,
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_CERT,
};
const client = new vision.ImageAnnotatorClient({ credentials });

let callsNum = 0;


async function visionApi(fastify, options) {
  fastify.get('/vision', async (request, reply) => {
    callsNum += 1;

    if (callsNum === process.env.MAX_CALL_PER_START) {
      reply.send({ message: 'LIMIT CALL. NOW WAIT OR PAY' });
      return;
    }

    client
      .labelDetection('./resources/test01.png')
      // .safeSearchDetection('./resources/test01.png')
      // .webDetection('./resources/test01.png')
      .then((results) => {
        console.log('Raw result', JSON.stringify(results));

        const labels = results[0].labelAnnotations;

        console.log('Labels:');
        labels.forEach(label => console.log(label.description));

        reply.send(results);
      })
      .catch((err) => {
        console.error('ERROR:', err);
        reply.send(err);
      });
  });
}

module.exports = visionApi;

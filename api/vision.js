'use strict';

const ipp = require('instagram-profile-picture');
const fue = require('file-utils-easy');
const vision = require('@google-cloud/vision');

const credentials = {
  projectId: process.env.GOOGLE_PROJECTID,
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_CERT,
};
const client = new vision.ImageAnnotatorClient({ credentials });

let callsNum = 0;


async function visionApi(fastify, options) {
  fastify.get('/vision/:profile', async (request, reply) => {
    callsNum += 1;

    if (callsNum === process.env.MAX_CALL_PER_START) {
      reply.send({ message: 'LIMIT CALL. NOW WAIT OR PAY' });
      return;
    }

    ipp(request.params.profile)
      .then(profileUrl => fue.saveUrlToFile(profileUrl, `./resources/${request.params.profile}.jpg`))
      .then(filePath => client.safeSearchDetection(filePath))
      // .labelDetection(filePath)
      // .webDetection(filePath)
      .then((results) => {
        console.log('Raw result', JSON.stringify(results));
        reply.send(JSON.stringify(results, null, 2));
      })
      .catch((err) => {
        console.error('ERROR:', err);
        reply.send(err);
      });
  });
}

module.exports = visionApi;

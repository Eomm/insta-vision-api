'use strict';

require('dotenv').config();
const vision = require('@google-cloud/vision');


const credentials = {
  projectId: process.env.GOOGLE_PROJECTID,
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_CERT,
  // keyFilename: '.google/google-api-auth.json',
};

// Creates a client
const client = new vision.ImageAnnotatorClient({ credentials });

// Performs label detection on the image file
client
  .labelDetection('./resources/test01.png')
  // .safeSearchDetection('./resources/test01.png')
  // .webDetection('./resources/test01.png')
  .then((results) => {
    console.log('Raw result', JSON.stringify(results));

    const labels = results[0].labelAnnotations;

    console.log('Labels:');
    labels.forEach(label => console.log(label.description));
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });

'use strict';

const ipp = require('instagram-profile-picture');

module.exports.handler = (event) => {
  const { profile } = event.pathParameters;
  console.info(`Getting profile ${profile} url image`);
  return ipp(profile)
    .then(url => ({ statusCode: 200, isBase64Encoded: false, body: JSON.stringify({ profile, url }) }))
    .catch(() => ({ statusCode: 500, isBase64Encoded: false, body: `Profile ${profile} not found` }));
};

'use strict';

const AWS = require('aws-sdk');
const https = require('https');
const http = require('http');

AWS.config.update({ region: process.env.AWS_REGION });

const storage = new AWS.S3({ apiVersion: '2006-03-01' });

function saveUrl(url, fileName) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {

      const buffers = [];
      response.on('error', (err) => { reject(err); });
      response.on('data', (buffer) => {
        buffers.push(buffer);
      });
      response.on('end', () => {
        const uploadParams = {
          Bucket: process.env.BUCKET,
          Key: fileName,
          Body: Buffer.concat(buffers),
        };
        resolve(storage.putObject(uploadParams).promise());
      });
    });
  });
}


module.exports = {
  saveUrl,
}

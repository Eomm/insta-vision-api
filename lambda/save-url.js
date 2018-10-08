'use strict';

const storage = require('./utils/save-to-s3');

module.exports.handler = (event) => {
  const { downloadUrl } = event;
  const fileName = 'test.jpg';
  console.info(`Downloading URL ${downloadUrl} to storage`, event);

  const x = 'https://scontent-frx5-1.cdninstagram.com/vp/6ba735de0f210ea34b242bd8e335c87f/5C4D28DD/t51.2885-19/26185888_319392668567125_3421688462040891392_n.jpg';
  return storage.saveUrl(x, fileName);
};

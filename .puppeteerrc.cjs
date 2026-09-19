const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Força o Puppeteer a baixar o Chrome dentro da pasta do projeto
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};

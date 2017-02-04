const fs = require('fs');
const path = require('path');

const initialize = (server) => {
  fs.readdir(path.resolve(__dirname, './'), (err, files) => {
    if (err) {
      throw err;
    }
    files.filter((file) => file !== 'index.js').forEach((file) => {
      const controller = require(path.resolve(__dirname, './', file)); // eslint-disable-line global-require
      controller.initialize(server);
    });
  });
};

module.exports = {
  initialize
};

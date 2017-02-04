const Catbox = require('catbox');
const CatboxRedis = require('catbox-redis');
const moment = require('moment');
const Promise = require('bluebird');

let cacheClient = null;

class Cache {
  constructor({ endpoint = '127.0.0.1:6379', password = '' } = {}) {
    cacheClient = new Catbox.Client(CatboxRedis, {
      partition: 'catbox-ozone',
      host: endpoint.split(':')[0],
      port: endpoint.split(':')[1],
      password
    });
  }
  start() {
    return new Promise((resolve, reject) => {
      cacheClient.start((err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }
  stop() {
    return new Promise((resolve) => {
      cacheClient.stop();
      resolve();
    });
  }
  get({ segment = 'cache', id }) {
    return new Promise((resolve, reject) => {
      cacheClient.get({
        segment,
        id
      }, (err, cached) => {
        if (err) {
          return reject(err);
        }
        if (cached && cached.item) {
          return resolve(cached.item);
        }
        return resolve();
      });
    });
  }
  drop({ segment = 'cache', id }) {
    return new Promise((resolve, reject) => {
      cacheClient.drop({
        segment,
        id
      }, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(true);
      });
    });
  }
  set({ segment = 'cache', id, value, ttl = 60 * 1000 }) {
    return new Promise((resolve, reject) => {
      cacheClient.set({
        segment,
        id
      }, {
        value,
        created: new Date(moment.utc().format())
      }, ttl, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }
}

module.exports = Cache;

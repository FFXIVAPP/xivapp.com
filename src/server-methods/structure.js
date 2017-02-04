const Promise = require('bluebird');

const initialize = ({
  server
}) => {
  const segment = 'structure';

  server.method(segment, (id, {
    patchVersion,
    platform,
    type
  }, next) => {
    const ignoredFields = {
      v: 0,
      __v: 0,
      _id: 0,
      patchVersion: 0,
      platform: 0,
      keyedIndex: 0,
      created: 0,
      updated: 0,
      latest: 0
    };
    const latest = patchVersion === 'latest';
    if (type) {
      const keyedIndex = `${patchVersion}-${platform}-${type}`;
      if (DB[type]) {
        DB[type].findOne(latest ? {
          platform,
          latest
        } : {
          keyedIndex
        }, ignoredFields, {
          lean: true
        }, (err, result) => {
          process.nextTick(() => next(err, result));
        });
      } else {
        process.nextTick(() => next());
      }
    } else {
      const promises = Config.StructureTypes.map((type) => {
        if (DB[type]) {
          return new Promise((resolve, reject) => {
            const keyedIndex = `${patchVersion}-${platform}-${type}`;
            DB[type].findOne(latest ? {
              platform,
              latest
            } : {
              keyedIndex
            }, ignoredFields, {
              lean: true
            }, (err, result) => {
              if (err) {
                return reject(err);
              }
              return resolve(result);
            });
          });
        }
        return Promise.resolve({});
      });
      Promise.all(promises)
        .then((results) => {
          const response = {};
          Config.StructureTypes.forEach((type, i) => {
            response[type] = results[i];
          });
          process.nextTick(() => next(null, response));
        })
        .catch((err) => {
          process.nextTick(() => next(err));
        });
    }
  }, {
    cache: {
      cache: 'redisCache',
      expiresIn: 24 * 60 * 60 * 1000,
      staleIn: 60 * 1000,
      segment,
      generateTimeout: 5000,
      staleTimeout: 1
    },
    generateKey: (params) => {
      return Object.keys(params).map((key) => params[key]).join('-');
    }
  });
};

module.exports = {
  initialize
};

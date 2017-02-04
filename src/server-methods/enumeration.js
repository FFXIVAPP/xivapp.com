const initialize = ({
  server
}) => {
  const segment = 'enumeration';

  server.method(segment, (id, {
    patchVersion,
    platform,
    key
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
      latest: 0,
      Key: 0
    };
    const latest = patchVersion === 'latest';
    if (key) {
      const keyedIndex = `${patchVersion}-${platform}-${key}`;
      if (DB.Enumeration) {
        DB.Enumeration.findOne(latest ? {
          platform,
          Key: key,
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
      const promises = Config.EnumerationKeys.map((type) => {
        if (DB.Enumeration) {
          return new Promise((resolve, reject) => {
            const keyedIndex = `${patchVersion}-${platform}-${type}`;
            DB.Enumeration.findOne(latest ? {
              platform,
              Key: type,
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
          Config.EnumerationKeys.forEach((type, i) => {
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

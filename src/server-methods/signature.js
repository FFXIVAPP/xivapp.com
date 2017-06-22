const initialize = ({
  server
}) => {
  const segment = 'offset';

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
      offset: 0
    };
    const latest = patchVersion === 'latest';
    const keyedIndex = `${patchVersion}-${platform}-${key}`;
    if (key) {
      if (DB.Signature) {
        DB.Signature.findOne(latest ? {
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
      DB.Signature.find(latest ? {
        platform,
        latest
      } : {
        patchVersion,
        platform
      }, ignoredFields, {
        lean: true
      }, (err, results) => {
        if (err) {
          return process.nextTick(() => next(err));
        }
        return process.nextTick(() => next(null, results));
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

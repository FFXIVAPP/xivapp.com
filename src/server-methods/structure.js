const rest = require('request-promise');

const restOptions = {
  json: true
};

const initialize = ({
  server
}) => {
  const segment = 'structure';

  server.method(segment, (id, {
    platform,
    gameLanguage
  }, next) => {
    // Get Latest Patch Version by Language
    const patchInfoURL = Config.PatchInfo.Structures;
    console.log(patchInfoURL);
    rest(patchInfoURL, restOptions)
      .then((patches) => {
        const patchVersion = patches[gameLanguage];
        if (patchVersion) {
          // Get the data required from the patch version
          const dataURL = `${Config.DataJSON.Structures}/${patchVersion}/${platform}.json`;
          console.log(dataURL);
          return rest(dataURL, restOptions)
            .then((signatures) => {
              process.nextTick(() => next(null, signatures));
            });
        } else {
          process.nextTick(() => next(new Error(`${gameLanguage} has no set patch version`)));
        }
      })
      .catch((err) => {
        process.nextTick(() => next(err));
      });
  }, {
    cache: {
      cache: 'redisCache',
      expiresIn: 30 * 24 * 60 * 60 * 1000,
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

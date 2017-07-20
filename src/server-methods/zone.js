const rest = require('request-promise');

const restOptions = {
  json: true
};
const Promise = require('bluebird');

const initialize = ({
  server
}) => {
  const segment = 'zone';

  server.method(segment, (id, next) => {
    const promises = Config.Languages.map((language) => {
      const URL = `${Config.XIVDB.URL}/maps/get/layers/placename?language=${language}`;
      console.log(URL);
      return rest(URL, restOptions);
    });
    Promise.all(promises)
      .then((results) => {
        const response = {};
        const maps = {
          en: results[0].data,
          fr: results[1].data,
          de: results[2].data,
          ja: results[3].data,
          ko: results[4].data,
          cn: results[5].data
        };
        Config.Languages.forEach((language) => {
          const places = maps[language];
          Object.keys(places).forEach((key) => {
            if (key !== '0') {
              const location = places[key][0];
              response[location.territory_id] = {
                Name: {
                  Chinese: maps.cn[key][0].placename,
                  Korean: maps.ko[key][0].placename,
                  English: maps.en[key][0].placename,
                  French: maps.fr[key][0].placename,
                  German: maps.de[key][0].placename,
                  Japanese: maps.ja[key][0].placename
                },
                Index: location.territory_type,
                IsDungeonInstance: false
              };
            }
          });
        });
        process.nextTick(() => next(null, response));
      })
      .catch((err) => {
        process.nextTick(() => next(err));
      });
  }, {
    cache: {
      cache: 'redisCache',
      expiresIn: 30 * 24 * 60 * 60 * 1000,
      staleIn: 12 * 60 * 60 * 1000,
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

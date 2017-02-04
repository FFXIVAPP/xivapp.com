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
    const promises = Config.Languages.map((language) => rest(`${Config.XIVDB.URL}/maps?language=${language}`, restOptions));
    Promise.all(promises)
      .then((results) => {
        const response = {};
        const maps = {
          en: results[0],
          fr: results[1],
          de: results[2],
          ja: results[3],
          ko: results[4],
          cn: results[5]
        };
        Config.Languages.forEach((language) => {
          const places = maps[language];
          places.forEach((place, placeIndex) => {
            const locations = place.placenames;
            locations.forEach((location, locationIndex) => {
              response[location.territory_id] = {
                Name: {
                  Chinese: maps.cn[placeIndex].placenames[locationIndex].name,
                  Korean: maps.ko[placeIndex].placenames[locationIndex].name,
                  English: maps.en[placeIndex].placenames[locationIndex].name,
                  French: maps.fr[placeIndex].placenames[locationIndex].name,
                  German: maps.de[placeIndex].placenames[locationIndex].name,
                  Japanese: maps.ja[placeIndex].placenames[locationIndex].name
                },
                Index: location.territory_type,
                IsDungeonInstance: false
              };
            });
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

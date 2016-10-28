const rest = require('request-promise');

const restOptions = {
  json: true
};

const Boom = require('boom');
const Promise = require('bluebird');

const setupRoutes = (server) => {

  const zoneInfo = (id, next) => {
    const promises = global.Config.Languages.map((language) => rest(`${global.Config.XIVDB.URL}/maps/places?language=${language}`, restOptions));
    Promise.all(promises)
      .then((results) => {
        const response = {};
        const places = {
          en: results[0],
          fr: results[1],
          de: results[2],
          ja: results[3],
          ko: results[4],
          cn: results[5]
        };
        global.Config.Languages.forEach((language) => {
          const place = places[language];
          Object.keys(place).forEach((key) => {
            const location = place[key];
            response[location.territory_type] = {
              Name: {
                Chinese: places.cn[location.id].name,
                Korean: places.ko[location.id].name,
                English: places.en[location.id].name,
                French: places.fr[location.id].name,
                German: places.de[location.id].name,
                Japanese: places.ja[location.id].name
              },
              Index: location.territory_type,
              IsDungeonInstance: false
            };
          });
        });
        process.nextTick(() => next(null, response));
      })
      .catch((err) => {
        process.nextTick(() => next(err));
      });
  };

  server.method('zone', zoneInfo, {
    cache: {
      cache: 'redisCache',
      expiresIn: 28 * 24 * 60 * 60 * 1000,
      segment: 'zone',
      generateTimeout: 5000
    }
  });

  // ZONES
  server.route({
    method: 'GET',
    path: '/api/zones',
    config: {
      tags: ['api'],
      description: 'A list of zones aggregated from XIVDB and ETL\'d into FFXIVAPP class formats.',
      handler: (request, reply) => {
        const ID = request.path.split('/').pop();
        server.methods.zone(ID, (err, result) => {
          if (err) {
            return reply(Boom.expectationFailed(err.message));
          }
          return reply(result);
        });
      }
    }
  });
};

module.exports = {
  setupRoutes
};

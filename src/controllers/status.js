const rest = require('request-promise');

const restOptions = {
  json: true
};

const Boom = require('boom');

const setupRoutes = (server) => {
  const statusInfo = (id, next) => {
    rest(`${global.Config.XIVDB.URL}/status`, restOptions)
      .then((statuses) => {
        const response = {};
        statuses.forEach((status) => {
          response[status.id] = {
            Name: {
              Chinese: status.name_cns,
              Korean: status.name_ko,
              English: status.name_en,
              French: status.name_fr,
              German: status.name_de,
              Japanese: status.name_ja
            },
            CompanyAction: false
          };
        });
        process.nextTick(() => next(null, response));
      })
      .catch((err) => {
        process.nextTick(() => next(err));
      });
  };

  server.method('status', statusInfo, {
    cache: {
      cache: 'redisCache',
      expiresIn: 28 * 24 * 60 * 60 * 1000,
      segment: 'status',
      generateTimeout: 1000
    }
  });

  // STATUS EFFECTS
  server.route({
    method: 'GET',
    path: '/api/statuses',
    config: {
      tags: ['api'],
      description: 'A list of status effects aggregated from XIVDB and ETL\'d into FFXIVAPP class formats.',
      handler: (request, reply) => {
        const ID = request.path.split('/').pop();
        server.methods.status(ID, (err, result) => {
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

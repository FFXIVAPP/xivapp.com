const Joi = require('joi');
const Boom = require('boom');

const {
  flatten
} = require('flat');

const initialize = (server) => {
  server.route({
    method: 'GET',
    path: '/api/structures',
    config: {
      tags: ['api'],
      description: 'Memory structures by patch version, platform.',
      validate: {
        query: {
          platform: Joi.string().valid(Config.Platforms).default('x64').required().description('Whether or not this is DX11 or DX9 based.'),
          gameLanguage: Joi.string().valid(Config.GameLanguages).default('English').optional().description('What language you play your game in. Used to determine most recent patchVersion')
        }
      },
      handler: (request, reply) => {
        const ID = global.Helpers.utils.generateCacheKey(request.path.split('/').pop(), request.query);
        server.methods.structure(ID, request.query, (err, result) => {
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
  initialize
};

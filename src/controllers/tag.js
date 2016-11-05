const Joi = require('joi');
const Boom = require('boom');

const {
  flatten
} = require('flat')

const setupRoutes = (server) => {
  server.route({
    method: 'PATCH',
    path: '/api/tag/{type}',
    config: {
      tags: ['api'],
      description: 'Update a data type by patch version to tag as latest; this will untag the current latest.',
      validate: (() => {
        const schemas = Object.keys(global.DB).filter((key) => key !== 'User' && key !== 'logger');
        const params = {
          type: Joi.string().valid(schemas).required()
        };
        const query = {
          appID: Joi.string().guid().required(),
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.'),
          platform: Joi.string().valid(global.Config.Platforms).default('x86').required().description('Whether or not this is DX11 or DX9 based.')
        };
        return {
          params,
          query
        };
      })(),
      handler: (request, reply) => {
        global.DB.User.findOne({
          _id: request.query.appID
        }, (err, result) => {
          if (err || !result) {
            return reply(Boom.unauthorized('Unauthorized "appID" in query parameter'));
          }
          const {
            type
          } = request.params;
          const {
            patchVersion,
            platform
          } = request.query;
          if (global.DB[type]) {
            const $unset = {
              latest: 1
            };
            const $set = {
              latest: true
            };
            const options = {
              upsert: false,
              new: true,
              multi: true
            };
            global.DB[type].update({
              platform
            }, {
              $unset
            }, options, (err) => {
              if (err) {
                return reply(Boom.expectationFailed(err.message));
              }
              global.DB[type].update({
                patchVersion,
                platform
              }, {
                $set
              }, options, (err) => {
                if (err) {
                  return reply(Boom.expectationFailed(err.message));
                }
                return reply({
                  success: true
                });
              });
            });
          } else {
            return reply(Boom.expectationFailed(`No associated schema to save for type of [${type}]`));
          }
        });
      }
    }
  });
};

module.exports = {
  setupRoutes
};

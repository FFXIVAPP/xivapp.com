const Joi = require('joi');
const Boom = require('boom');

const {
  flatten
} = require('flat');

const initialize = (server) => {
  server.route({
    method: 'GET',
    path: '/api/signatures',
    config: {
      tags: ['api'],
      description: 'Memory signatures by platform version and platform.',
      validate: {
        query: {
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.').default('latest'),
          platform: Joi.string().valid(Config.Platforms).default('x64').required().description('Whether or not this is DX11 or DX9 based.')
        }
      },
      handler: (request, reply) => {
        const ID = global.Helpers.utils.generateCacheKey(request.path.split('/').pop(), request.query);
        server.methods.offset(ID, request.query, (err, result) => {
          if (err) {
            return reply(Boom.expectationFailed(err.message));
          }
          return reply(result);
        });
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/signatures/{key}',
    config: {
      tags: ['api'],
      description: 'Memory signatures by platform version and platform.',
      validate: {
        params: {
          key: Joi.string().valid(Config.SignatureKeys)
        },
        query: {
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.').default('latest'),
          platform: Joi.string().valid(Config.Platforms).default('x64').required().description('Whether or not this is DX11 or DX9 based.')
        }
      },
      handler: (request, reply) => {
        const ID = global.Helpers.utils.generateCacheKey(request.path.split('/').pop(), request.query);
        server.methods.offset(ID, {
          ...request.query,
          ...request.params
        }, (err, result) => {
          if (err) {
            return reply(Boom.expectationFailed(err.message));
          }
          return reply(result);
        });
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/signatures/{key}',
    config: {
      tags: ['api'],
      description: 'Memory signatures created for patch version and platform by type.',
      validate: (() => {
        const params = {
          key: Joi.string().valid(Config.SignatureKeys).required()
        };
        const query = {
          appID: Joi.string().guid().required(),
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.'),
          platform: Joi.string().valid(Config.Platforms).default('x64').required().description('Whether or not this is DX11 or DX9 based.')
        };
        const payload = {};
        Object.keys(DB.Signature.schema.paths).forEach((key) => {
          if (!['v', '__v', '_id', 'created', 'updated', 'keyedIndex', 'platform', 'patchVersion', 'Key', 'latest'].includes(key)) {
            const type = DB.Signature.schema.paths[key].instance;
            if (type === 'Array') {
              const arrayType = DB.Signature.schema.paths[key].casterConstructor.schemaName;
              payload[key] = Joi[type.toLowerCase()]().items(Joi[arrayType.toLowerCase()]());
            } else {
              payload[key] = Joi[type.toLowerCase()]();
            }
          }
        });
        return {
          params,
          query,
          payload
        };
      })(),
      handler: (request, reply) => {
        DB.User.findOne({
          _id: request.query.appID
        }, (err, result) => {
          if (err || !result) {
            return reply(Boom.unauthorized('Unauthorized "appID" in query parameter'));
          }
          const {
            key
          } = request.params;
          const {
            patchVersion,
            platform
          } = request.query;
          const keyedIndex = `${patchVersion}-${platform}-${key}`;
          DB.Signature.create({
            ...request.payload,
            patchVersion,
            platform,
            keyedIndex,
            Key: key
          }, (err, saved) => {
            if (err) {
              return reply(Boom.expectationFailed(err.message));
            }
            return reply({
              _id: saved._id
            });
          });
        });
      }
    }
  });

  server.route({
    method: 'PATCH',
    path: '/api/signatures/{key}',
    config: {
      tags: ['api'],
      description: 'Memory signatures to update for patch version and platform by type.',
      validate: (() => {
        const params = {
          key: Joi.string().valid(Config.SignatureKeys).required()
        };
        const query = {
          appID: Joi.string().guid().required(),
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.'),
          platform: Joi.string().valid(Config.Platforms).default('x64').required().description('Whether or not this is DX11 or DX9 based.')
        };
        const payload = {};
        Object.keys(DB.Signature.schema.paths).forEach((key) => {
          if (!['v', '__v', '_id', 'created', 'updated', 'keyedIndex', 'platform', 'patchVersion', 'Key', 'latest'].includes(key)) {
            const type = DB.Signature.schema.paths[key].instance;
            if (type === 'Array') {
              const arrayType = DB.Signature.schema.paths[key].casterConstructor.schemaName;
              payload[key] = Joi[type.toLowerCase()]().items(Joi[arrayType.toLowerCase()]());
            } else {
              payload[key] = Joi[type.toLowerCase()]();
            }
          }
        });
        return {
          params,
          query,
          payload
        };
      })(),
      handler: (request, reply) => {
        DB.User.findOne({
          _id: request.query.appID
        }, (err, result) => {
          if (err || !result) {
            return reply(Boom.unauthorized('Unauthorized "appID" in query parameter'));
          }
          const {
            key
          } = request.params;
          const {
            patchVersion,
            platform
          } = request.query;
          const keyedIndex = `${patchVersion}-${platform}-${key}`;
          const $set = flatten({
            ...request.payload,
            patchVersion,
            platform,
            keyedIndex,
            Key: key
          });
          DB.Signature.findOneAndUpdate({
            keyedIndex
          }, {
            $set
          }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          }, (err, saved) => {
            if (err) {
              return reply(Boom.expectationFailed(err.message));
            }
            return reply({
              _id: saved._id
            });
          });
        });
      }
    }
  });
};

module.exports = {
  initialize
};

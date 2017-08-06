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
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.').default('latest'),
          platform: Joi.string().valid(Config.Platforms).default('x64').required().description('Whether or not this is DX11 or DX9 based.')
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

  server.route({
    method: 'GET',
    path: '/api/structures/{type}',
    config: {
      tags: ['api'],
      description: 'Memory structures for patch version and platform by type.',
      validate: {
        params: {
          type: Joi.string().valid(Config.StructureTypes).default(Config.StructureTypes[0])
        },
        query: {
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.').default('latest'),
          platform: Joi.string().valid(Config.Platforms).default('x64').required().description('Whether or not this is DX11 or DX9 based.')
        }
      },
      handler: (request, reply) => {
        const ID = global.Helpers.utils.generateCacheKey(request.path.split('/').pop(), request.query);
        server.methods.structure(ID, {
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
    method: 'GET',
    path: '/api/structures/{type}/schema',
    config: {
      tags: ['api'],
      description: 'Memory structure schema by type.',
      validate: {
        params: {
          type: Joi.string().valid(Config.StructureTypes).default(Config.StructureTypes[0])
        }
      },
      handler: (request, reply) => {
        const {
          type
        } = request.params;
        if (DB[type]) {
          const response = {};
          Object.keys(DB[type].schema.paths).forEach((key) => {
            if (!['v', '__v', '_id', 'created', 'updated', 'patchVersion', 'platform', 'latest'].includes(key)) {
              response[key] = DB[type].schema.paths[key].instance;
            }
          });
          return reply(response);
        }
        return reply(Boom.expectationFailed(`No associated schema to save for type of [${type}]`));
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/structures/{type}',
    config: {
      tags: ['api'],
      description: 'Memory structures created for patch version and platform by type.',
      validate: (() => {
        const params = {
          type: Joi.string().valid(Config.StructureTypes).default(Config.StructureTypes[0])
        };
        const query = {
          appID: Joi.string().guid().required(),
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.'),
          platform: Joi.string().valid(Config.Platforms).default('x64').required().description('Whether or not this is DX11 or DX9 based.')
        };
        const payload = {};
        Object.keys(DB).filter((type) => !['logger', 'Signature', 'User'].includes(type)).forEach((type) => {
          const SchemaType = type;
          const Schema = DB[SchemaType];
          Object.keys(Schema.schema.paths).forEach((key) => {
            if (!['v', '__v', '_id', 'created', 'updated', 'keyedIndex', 'patchVersion', 'platform', 'latest'].includes(key)) {
              const type = Schema.schema.paths[key].instance;
              if (key === 'Array') {
                const arrayType = Schema.schema.paths[key].casterConstructor.schemaName;
                payload[key] = Joi[type.toLowerCase()]().items(Joi[arrayType.toLowerCase()]());
              } else {
                payload[key] = Joi[type.toLowerCase()]();
              }
            }
          });
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
            patchVersion,
            platform
          } = request.query;
          const {
            type
          } = request.params;
          if (DB[type]) {
            const keyedIndex = `${patchVersion}-${platform}-${type}`;
            DB[type].create({
              ...request.payload,
              patchVersion,
              platform,
              keyedIndex
            }, (err, saved) => {
              if (err) {
                return reply(Boom.expectationFailed(err.message));
              }
              return reply({
                _id: saved._id
              });
            });
          } else {
            return reply(Boom.expectationFailed(`No associated schema to save for type of [${type}]`));
          }
        });
      }
    }
  });

  server.route({
    method: 'PATCH',
    path: '/api/structures/{type}',
    config: {
      tags: ['api'],
      description: 'Memory structures to update for patch version and platform by type.',
      validate: (() => {
        const params = {
          type: Joi.string().valid(Config.StructureTypes).default(Config.StructureTypes[0])
        };
        const query = {
          appID: Joi.string().guid().required(),
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.'),
          platform: Joi.string().valid(Config.Platforms).default('x64').required().description('Whether or not this is DX11 or DX9 based.')
        };
        const payload = {};
        Object.keys(DB).filter((type) => !['logger', 'Signature', 'User'].includes(type)).forEach((type) => {
          const SchemaType = type;
          const Schema = DB[SchemaType];
          Object.keys(Schema.schema.paths).forEach((key) => {
            if (!['v', '__v', '_id', 'created', 'updated', 'keyedIndex', 'patchVersion', 'platform', 'latest'].includes(key)) {
              const type = Schema.schema.paths[key].instance;
              if (key === 'Array') {
                const arrayType = Schema.schema.paths[key].casterConstructor.schemaName;
                payload[key] = Joi[type.toLowerCase()]().items(Joi[arrayType.toLowerCase()]());
              } else {
                payload[key] = Joi[type.toLowerCase()]();
              }
            }
          });
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
            type
          } = request.params;
          const {
            patchVersion,
            platform
          } = request.query;
          if (DB[type]) {
            const keyedIndex = `${patchVersion}-${platform}-${type}`;
            const $set = flatten({
              ...request.payload,
              patchVersion,
              platform,
              keyedIndex
            });
            DB[type].findOneAndUpdate({
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
          } else {
            return reply(Boom.expectationFailed(`No associated schema to save for type of [${type}]`));
          }
        });
      }
    }
  });
};

module.exports = {
  initialize
};

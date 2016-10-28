const Joi = require('joi');
const Boom = require('boom');
const Promise = require('bluebird');

const setupRoutes = (server) => {
  const structureInfo = (id, {
    patchVersion,
    platform,
    type
  }, next) => {
    if (type) {
      if (global.DB[type]) {
        global.DB[type].findOne({
          patchVersion,
          platform
        }, {
          v: 0,
          __v: 0
        }, {
          lean: true
        }, (err, result) => {
          process.nextTick(() => next(err, result));
        });
      } else {
        process.nextTick(() => next());
      }
    } else {
      const promises = global.Config.StructureTypes.map((type) => {
        if (global.DB[type]) {
          return new Promise((resolve, reject) => {
            global.DB[type].findOne({
              patchVersion,
              platform
            }, {
              v: 0,
              __v: 0
            }, {
              lean: true
            }, (err, result) => {
              if (err) {
                return reject(err);
              }
              return resolve(result);
            });
          });
        }
        return Promise.resolve({});
      });
      Promise.all(promises)
        .then((results) => {
          const response = {};
          global.Config.StructureTypes.forEach((type, i) => {
            response[type] = results[i];
          });
          process.nextTick(() => next(null, response));
        })
        .catch((err) => {
          process.nextTick(() => next(err));
        });
    }
  };

  server.method('structure', structureInfo, {
    cache: {
      cache: 'redisCache',
      expiresIn: 28 * 24 * 60 * 60 * 1000,
      segment: 'structure',
      generateTimeout: 5000
    },
    generateKey: (id, query) => {
      return [id, ...Object.keys(query).map((key) => query[key])].join('-');
    }
  });

  server.route({
    method: 'GET',
    path: '/api/structures',
    config: {
      tags: ['api'],
      description: 'Memory structures by patch version, platform.',
      validate: {
        query: {
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.'),
          platform: Joi.string().valid(global.Config.Platforms).default('x86').required().description('Whether or not this is DX11 or DX9 based.')
        }
      },
      handler: (request, reply) => {
        const ID = request.path.split('/').pop();
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
          type: Joi.string().valid(global.Config.StructureTypes).default(global.Config.StructureTypes[0])
        },
        query: {
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.'),
          platform: Joi.string().valid(global.Config.Platforms).default('x86').required().description('Whether or not this is DX11 or DX9 based.')
        }
      },
      handler: (request, reply) => {
        const ID = request.path.split('/').pop();
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
          type: Joi.string().valid(global.Config.StructureTypes).default(global.Config.StructureTypes[0])
        }
      },
      handler: (request, reply) => {
        const {
          type
        } = request.params;
        if (global.DB[type]) {
          const response = {};
          Object.keys(global.DB[type].schema.paths).forEach((key) => {
            if (!['v', '__v', '_id', 'created', 'updated', 'patchVersion', 'platform'].includes(key)) {
              response[key] = global.DB[type].schema.paths[key].instance;
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
          type: Joi.string().valid(global.Config.StructureTypes).default(global.Config.StructureTypes[0])
        };
        const query = {
          appID: Joi.string().guid().required()
        };
        const payload = {
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.'),
          platform: Joi.string().valid(global.Config.Platforms).default('x86').required().description('Whether or not this is DX11 or DX9 based.')
        };
        Object.keys(global.DB).filter((type) => !['logger', 'Signature', 'User'].includes(type)).forEach((type) => {
          const SchemaType = type;
          const Schema = global.DB[SchemaType];
          Object.keys(Schema.schema.paths).forEach((key) => {
            if (!['v', '__v', '_id', 'created', 'updated', 'keyedIndex', 'patchVersion', 'platform'].includes(key)) {
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
        global.DB.User.findOne({
          _id: request.query.appID
        }, (err, result) => {
          if (err || !result) {
            return reply(Boom.unauthorized('Unauthorized "appID" in query parameter'));
          }
          const {
            type
          } = request.params;
          if (global.DB[type]) {
            global.DB[type].create(request.payload, (err, saved) => {
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
          type: Joi.string().valid(global.Config.StructureTypes).default(global.Config.StructureTypes[0])
        };
        const query = {
          appID: Joi.string().guid().required()
        };
        const payload = {
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.'),
          platform: Joi.string().valid(global.Config.Platforms).default('x86').required().description('Whether or not this is DX11 or DX9 based.'),
        };
        Object.keys(global.DB).filter((type) => !['logger', 'Signature', 'User'].includes(type)).forEach((type) => {
          const SchemaType = type;
          const Schema = global.DB[SchemaType];
          Object.keys(Schema.schema.paths).forEach((key) => {
            if (!['v', '__v', '_id', 'created', 'updated', 'keyedIndex', 'patchVersion', 'platform'].includes(key)) {
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
          } = request.payload;
          if (global.DB[type]) {
            global.DB[type].findOneAndUpdate({
              patchVersion,
              platform
            }, request.payload, {
              upsert: true,
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
  setupRoutes
};

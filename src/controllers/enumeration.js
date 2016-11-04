const Joi = require('joi');
const Boom = require('boom');

const {
  flatten
} = require('flat')

const setupRoutes = (server) => {
  const enumerationInfo = (id, {
    patchVersion,
    platform,
    key
  }, next) => {
    const keyedIndex = `${patchVersion}-${platform}-${key}`;
    if (key) {
      if (global.DB.Enumeration) {
        global.DB.Enumeration.findOne({
          keyedIndex
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
      global.DB.Enumeration.find({
        patchVersion,
        platform
      }, {
        v: 0,
        __v: 0
      }, {
        lean: true
      }, (err, results) => {
        if (err) {
          return process.nextTick(() => next(err));
        }
        return process.nextTick(() => next(null, results));
      });
    }
  };

  server.method('enumeration', enumerationInfo, {
    cache: {
      cache: 'redisCache',
      expiresIn: 28 * 24 * 60 * 60 * 1000,
      segment: 'enumeration',
      generateTimeout: 5000
    },
    generateKey: (id, query) => {
      return [id, ...Object.keys(query).map((key) => query[key])].join('-');
    }
  });

  server.route({
    method: 'GET',
    path: '/api/enums',
    config: {
      tags: ['api'],
      description: 'Memory enums by platform version and platform.',
      validate: {
        query: {
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.'),
          platform: Joi.string().valid(global.Config.Platforms).default('x86').required().description('Whether or not this is DX11 or DX9 based.')
        }
      },
      handler: (request, reply) => {
        const ID = request.path.split('/').pop();
        server.methods.enumeration(ID, request.query, (err, result) => {
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
    path: '/api/enums/{key}',
    config: {
      tags: ['api'],
      description: 'Memory enums by platform version and platform.',
      validate: {
        params: {
          key: Joi.string().valid(global.Config.EnumerationKeys)
        },
        query: {
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.'),
          platform: Joi.string().valid(global.Config.Platforms).default('x86').required().description('Whether or not this is DX11 or DX9 based.')
        }
      },
      handler: (request, reply) => {
        const ID = request.path.split('/').pop();
        server.methods.enumeration(ID, {
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
    path: '/api/enums/{key}',
    config: {
      tags: ['api'],
      description: 'Memory enums created for patch version and platform by type.',
      validate: (() => {
        const params = {
          key: Joi.string().valid(global.Config.EnumerationKeys).required()
        };
        const query = {
          appID: Joi.string().guid().required(),
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.'),
          platform: Joi.string().valid(global.Config.Platforms).default('x86').required().description('Whether or not this is DX11 or DX9 based.')
        };
        const payload = {};
        Object.keys(global.DB.Enumeration.schema.paths).forEach((key) => {
          if (!['v', '__v', '_id', 'created', 'updated', 'keyedIndex', 'platform', 'patchVersion', 'Key'].includes(key)) {
            const type = global.DB.Enumeration.schema.paths[key].instance;
            if (type === 'Array') {
              const arrayType = global.DB.Enumeration.schema.paths[key].casterConstructor.schemaName;
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
        global.DB.User.findOne({
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
          global.DB.Enumeration.create({
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
        });
      }
    }
  });

  server.route({
    method: 'PATCH',
    path: '/api/enums/{key}',
    config: {
      tags: ['api'],
      description: 'Memory enums to update for patch version and platform by type.',
      validate: (() => {
        const params = {
          key: Joi.string().valid(global.Config.EnumerationKeys).required()
        };
        const query = {
          appID: Joi.string().guid().required(),
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.'),
          platform: Joi.string().valid(global.Config.Platforms).default('x86').required().description('Whether or not this is DX11 or DX9 based.')
        };
        const payload = {};
        Object.keys(global.DB.Enumeration.schema.paths).forEach((key) => {
          if (!['v', '__v', '_id', 'created', 'updated', 'keyedIndex', 'platform', 'patchVersion', 'Key'].includes(key)) {
            const type = global.DB.Enumeration.schema.paths[key].instance;
            if (type === 'Array') {
              const arrayType = global.DB.Enumeration.schema.paths[key].casterConstructor.schemaName;
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
        global.DB.User.findOne({
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
            keyedIndex
          });
          global.DB.Enumeration.findOneAndUpdate({
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
  setupRoutes
};

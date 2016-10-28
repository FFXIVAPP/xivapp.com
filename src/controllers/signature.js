const Joi = require('joi');
const Boom = require('boom');

const {
  flatten
} = require('flat')

const setupRoutes = (server) => {
  const offsetInfo = (id, {
    patchVersion,
    platform,
    Key
  }, next) => {
    if (Key) {
      if (global.DB.Signature) {
        global.DB.Signature.findOne({
          patchVersion,
          platform,
          Key
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
      global.DB.Signature.find({
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

  server.method('offset', offsetInfo, {
    cache: {
      cache: 'redisCache',
      expiresIn: 28 * 24 * 60 * 60 * 1000,
      segment: 'offset',
      generateTimeout: 5000
    },
    generateKey: (id, query) => {
      return [id, ...Object.keys(query).map((key) => query[key])].join('-');
    }
  });

  server.route({
    method: 'GET',
    path: '/api/signatures',
    config: {
      tags: ['api'],
      description: 'Memory signatures by platform version and platform.',
      validate: {
        query: {
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.'),
          platform: Joi.string().valid(global.Config.Platforms).default('x86').required().description('Whether or not this is DX11 or DX9 based.')
        }
      },
      handler: (request, reply) => {
        const ID = request.path.split('/').pop();
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
    path: '/api/signatures/{Key}',
    config: {
      tags: ['api'],
      description: 'Memory signatures by platform version and platform.',
      validate: {
        params: {
          Key: Joi.string().valid(global.Config.SignatureKeys)
        },
        query: {
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.'),
          platform: Joi.string().valid(global.Config.Platforms).default('x86').required().description('Whether or not this is DX11 or DX9 based.')
        }
      },
      handler: (request, reply) => {
        const ID = request.path.split('/').pop();
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
    path: '/api/signatures',
    config: {
      tags: ['api'],
      description: 'Memory signatures created for patch version and platform by type.',
      validate: (() => {
        const query = {
          appID: Joi.string().guid().required()
        };
        const payload = {
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.'),
          platform: Joi.string().valid(global.Config.Platforms).default('x86').required().description('Whether or not this is DX11 or DX9 based.'),
          Key: Joi.string().valid(global.Config.SignatureKeys).required()
        };
        Object.keys(global.DB.Signature.schema.paths).forEach((key) => {
          if (!['v', '__v', '_id', 'created', 'updated', 'keyedIndex', 'platform', 'patchVersion', 'Key'].includes(key)) {
            const type = global.DB.Signature.schema.paths[key].instance;
            if (type === 'Array') {
              const arrayType = global.DB.Signature.schema.paths[key].casterConstructor.schemaName;
              payload[key] = Joi[type.toLowerCase()]().items(Joi[arrayType.toLowerCase()]());
            } else {
              payload[key] = Joi[type.toLowerCase()]();
            }
          }
        });
        return {
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
            patchVersion,
            platform,
            Key
          } = request.payload;
          const keyedIndex = `${patchVersion}-${platform}-${Key}`;
          global.DB.Signature.create({
            ...request.payload,
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
    path: '/api/signatures',
    config: {
      tags: ['api'],
      description: 'Memory signatures to update for patch version and platform by type.',
      validate: (() => {
        const query = {
          appID: Joi.string().guid().required()
        };
        const payload = {
          patchVersion: Joi.string().min(1).required().description('Patch version of the game into which this data applies.'),
          platform: Joi.string().valid(global.Config.Platforms).default('x86').required().description('Whether or not this is DX11 or DX9 based.'),
          Key: Joi.string().valid(global.Config.SignatureKeys).required()
        };
        Object.keys(global.DB.Signature.schema.paths).forEach((key) => {
          if (!['v', '__v', '_id', 'created', 'updated', 'keyedIndex', 'platform', 'patchVersion', 'Key'].includes(key)) {
            const type = global.DB.Signature.schema.paths[key].instance;
            if (type === 'Array') {
              const arrayType = global.DB.Signature.schema.paths[key].casterConstructor.schemaName;
              payload[key] = Joi[type.toLowerCase()]().items(Joi[arrayType.toLowerCase()]());
            } else {
              payload[key] = Joi[type.toLowerCase()]();
            }
          }
        });
        return {
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
            patchVersion,
            platform,
            Key
          } = request.payload;
          const keyedIndex = `${patchVersion}-${platform}-${Key}`;
          const $set = flatten({
            ...request.payload,
            keyedIndex
          });
          global.DB.Signature.findOneAndUpdate({
            patchVersion,
            platform,
            Key
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

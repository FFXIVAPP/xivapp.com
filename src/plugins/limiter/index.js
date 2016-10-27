const Boom = require('boom');
const Hoek = require('hoek');
const redis = require('redis');
const RateLimiter = require('ratelimiter');

const pkg = require('./package.json');

const internals = {};

internals.defaults = {
  redis: {},
  namespace: 'limiter',
  global: {
    limit: -1,
    duration: 1
  }
};

exports.name = 'limiter';

exports.register = (plugin, options, next) => {
  const settings = Hoek.applyToDefaults(internals.defaults, options);
  const redisClient = redis.createClient(options.redis.port, options.redis.host, options.redis.options);

  plugin.ext('onPreAuth', (request, reply) => {
    const route = request.route;
    let routeLimit = route.settings.plugins && route.settings.plugins.limiter;
    if (!routeLimit && settings.global.limit > 0) {
      routeLimit = settings.global;
    }
    if (routeLimit) {
      const keyID = `${settings.namespace}:${request.info.remoteAddress}:${route.path}`;
      const rateLimiter = new RateLimiter({
        id: keyID,
        db: redisClient,
        max: routeLimit.limit,
        duration: routeLimit.duration * 1000
      });
      rateLimiter.get((err, limit) => {
        if (err) {
          return reply(err);
        }
        const {
          total,
          remaining,
          reset
        } = limit;
        request.plugins.limiter = {
          limit: total,
          remaining: remaining - 1,
          reset
        };
        if (limit.remaining <= 0) {
          const error = Boom.tooManyRequests('Rate Limit Exceeded');
          error.output.headers = {
            ...error.output.headers,
            ['X-Rate-Limit-Limit']: request.plugins.limiter.limit,
            ['X-Rate-Limit-Remaining']: request.plugins.limiter.remaining,
            ['X-Rate-Limit-Reset']: request.plugins.limiter.reset
          };
          error.reformat();
          return reply(error);
        }
        return reply.continue();
      });
    } else {
      return reply.continue();
    }
  });

  plugin.ext('onPostHandler', (request, reply) => {
    if (request.plugins.limiter) {
      const response = request.response;
      if (!response.isBoom) {
        response.headers['X-Rate-Limit-Limit'] = request.plugins.limiter.limit;
        response.headers['X-Rate-Limit-Remaining'] = request.plugins.limiter.remaining;
        response.headers['X-Rate-Limit-Reset'] = request.plugins.limiter.reset;
      }
    }
    reply.continue();
  });

  process.nextTick(() => {
    next();
  });
};

exports.register.attributes = {
  pkg
};

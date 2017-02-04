module.exports = {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: 6379,
    options: {}
  },
  namespace: 'limiter',
  global: {
    limit: 250,
    duration: 30
  }
};

const {
  Server
} = require('hapi');

const Good = require('good');
const Inert = require('inert');
const Vision = require('vision');

const HapiSwagger = require('hapi-swagger');
const Pack = require('../package.json');
const CatboxRedis = require('catbox-redis');

const Limiter = require('./plugins/limiter/');

const fs = require('fs');
const path = require('path');
const Zlib = require('zlib');

const CONTROLLER_PATH = './controllers/';

const DataService = require('./data-service/');

const server = new Server({
  cache: [{
    name: 'redisCache',
    engine: CatboxRedis,
    host: '127.0.0.1',
    partition: 'cache'
  }],
  connections: {
    router: {
      isCaseSensitive: false,
      stripTrailingSlash: true
    },
    compression: true,
    routes: {
      cors: {
        credentials: true
      },
      security: {
        xframe: false
      },
      files: {
        relativeTo: __dirname
      },
      validate: {
        options: {
          allowUnknown: true,
          abortEarly: false
        }
      },
      response: {
        modify: true,
        options: {
          stripUnknown: true,
          abortEarly: false
        }
      }
    }
  }
});

const LoggingOptions = require('./configuration/logging.js');

const serverLog = (tags, data = {}) => {
  if (server && server.plugins.good) {
    server.log(tags, data);
  } else {
    console.log(tags, data);
  }
};

const handleError = (err, fatal) => {
  serverLog('error', `${err.message}\n${err.stack}`);
  if (fatal) {
    process.exit(1);
  }
};

module.exports = function (startServer = true) {
  server.on('request-error', (request, err) => {
    serverLog('debug', 'request-error');
    handleError(err);
  });
  process.on('uncaughtException', (err) => {
    serverLog('debug', 'uncaughtException');
    handleError(err, true);
  });
  process.on('SIGTERM', () => {
    serverLog('debug', 'shutting down');
    process.exit();
  });
  server.connection({
    host: '0.0.0.0',
    port: 10000,
    routes: {
      payload: {
        compression: {
          special: {
            chunkSize: 16 * 1024
          }
        }
      }
    }
  });
  const plugins = [{
    register: Good,
    options: LoggingOptions
  }, {
    register: Inert
  }, {
    register: Vision
  }, {
    register: HapiSwagger,
    options: {
      documentationPath: '/docs',
      info: {
        title: 'XIVAPP',
        version: Pack.version
      }
    }
  }, {
    register: Limiter,
    options: Config.LimiterOptions
  }];
  server.register(plugins, (err) => {
    if (err) {
      serverLog('debug', 'registerError');
      handleError(err, true);
      return;
    }
    if (startServer) {
      const dataService = new DataService({
        config: global.Config.mongo,
        logger: serverLog
      });
      dataService.ensureConnection()
        .then((database) => {
          global.DB = database;

          // SETUP ROUTES
          fs.readdir(path.resolve(__dirname, CONTROLLER_PATH), (err, files) => {
            if (err) {
              throw err;
            }
            files.forEach((file) => {
              require(path.resolve(__dirname, CONTROLLER_PATH, file)).setupRoutes(server); // eslint-disable-line global-require
            });
          });

          server.decoder('special', (options) => Zlib.createGunzip(options));

          server.start((err) => {
            if (err) {
              serverLog('debug', 'startError');
              handleError(err, true);
              return;
            }
            console.log('Server Running @', server.info.uri);
          });
        })
        .catch((err) => {
          serverLog('debug', 'dbConnectionError');
          handleError(err, true);
        });
    }
  });
  return server;
};

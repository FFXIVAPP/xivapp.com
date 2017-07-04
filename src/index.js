const fs = require('fs');
const path = require('path');
const Zlib = require('zlib');

const async = require('async');
const CatboxRedis = require('catbox-redis');
const Good = require('good');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const {
  Server
} = require('hapi');
const Vision = require('vision');

global.Config = require('./config.js');
global.Pack = require('../package.json');
global.Helpers = require('./helpers/');

const DataService = require('./data-service/');
const controllers = require('./controllers/');
const serverMethods = require('./server-methods/');

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

const registerCustomPlugins = () => {
  const directory = path.resolve(__dirname, './plugins');
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, items) => {
      if (err) {
        return reject(err);
      }
      const plugins = [];
      items.forEach((item) => {
        if (fs.statSync(path.resolve(directory, item)).isDirectory()) {
          const indexFile = path.resolve(directory, item);
          const configFile = path.resolve(directory, item, 'config.js');

          const plugin = require(indexFile); // eslint-disable-line global-require
          let pluginConfig = {};

          try {
            pluginConfig = require(configFile); // eslint-disable-line global-require
          } catch (err) {
            // IGNORED
          }

          plugins.push({
            info: {
              register: plugin,
              options: pluginConfig
            }
          });
        }
      });
      async.whilst(
        () => {
          return plugins.length;
        },
        (cb) => {
          const {
            info
          } = plugins.shift();
          server.register(info, (err) => {
            cb(err);
          });
        },
        (err) => {
          if (err) {
            return reject(err);
          }
          return resolve();
        }
      );
    });
  });
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

  server.register([{
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
        version: global.Pack.version
      },
      schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http']
    }
  }], (err) => {
    if (err) {
      serverLog('debug', 'registerError');
      handleError(err, true);
      return;
    }

    Promise.resolve()
      .then(() => registerCustomPlugins(server))
      .then(() => {
        // AJAX/FETCH CALLS
        server.route({
          method: 'OPTIONS',
          path: '/{param*}',
          config: {
            auth: false,
            handler: (request, reply) => {
              const accessControlAllowHeaders = [];
              Object.keys(request.headers).forEach((index) => {
                accessControlAllowHeaders.push(request.headers[index]);
              });
              reply().type('text/plain')
                .header('Access-Control-Allow-Origin', '*')
                .header('Access-Control-Allow-Headers', accessControlAllowHeaders.join(', ').trim())
                .header('Access-Control-Allow-Methods', 'HEAD,PUT,GET,POST,DELETE');
            }
          }
        });

        // ROOT
        server.route({
          method: 'GET',
          path: '/{param*}',
          handler: {
            directory: {
              path: path.join(__dirname, '../static'),
              index: true,
              lookupCompressed: true
            }
          }
        });

        const dataService = new DataService({
          config: Config.mongo,
          logger: serverLog
        });

        dataService.ensureConnection()
          .then((database) => {
            global.DB = database;

            // SETUP SERVER METHODS
            serverMethods.initialize(server);

            // SETUP CONTROLLERS/ROUTES
            controllers.initialize(server);

            if (startServer) {
              server.decoder('special', (options) => Zlib.createGunzip(options));

              server.app.cache = new global.Helpers.Cache();

              server.app.cache.start()
                .then(() => {
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
                  serverLog('debug', 'startCacheError');
                  handleError(err, true);
                });
            }
          })
          .catch((err) => {
            serverLog('debug', 'startDBError');
            handleError(err, true);
          });
      })
      .catch((err) => {
        handleError(err, true);
      });
  });
  return server;
};

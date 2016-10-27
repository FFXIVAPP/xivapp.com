const path = require('path');

const setupRoutes = (server) => {
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
        path: path.join(__dirname, '../../static'),
        index: true,
        lookupCompressed: true
      }
    }
  });

  // STATUS
  server.route({
    method: 'GET',
    path: '/health',
    config: {
      handler: (request, reply) => {
        reply({
          running: true
        });
      }
    }
  });
};

module.exports = {
  setupRoutes
};

const initialize = (server) => {
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
  initialize
};

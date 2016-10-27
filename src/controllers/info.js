const setupRoutes = (server) => {
  server.route({
    method: 'GET',
    path: '/api/supported',
    config: {
      tags: ['api'],
      description: 'An object of supported API query parameters',
      handler: (request, reply) => {
        reply({
          languages: global.Config.Languages,
          gameVersions: global.Config.GameVersions
        });
      }
    }
  });
};

module.exports = {
  setupRoutes
};

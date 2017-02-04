const initialize = (server) => {
  server.route({
    method: 'GET',
    path: '/api/supported',
    config: {
      tags: ['api'],
      description: 'An object of supported API query parameters',
      handler: (request, reply) => {
        reply({
          languages: Config.Languages,
          gameVersions: Config.GameVersions
        });
      }
    }
  });
};

module.exports = {
  initialize
};

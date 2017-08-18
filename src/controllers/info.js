const initialize = (server) => {
  server.route({
    method: 'GET',
    path: '/api/supported',
    config: {
      tags: ['api'],
      description: 'An object of supported API query parameters',
      handler: (request, reply) => {
        reply({
          platform: Config.Platforms,
          gameLanguage: Config.GameLanguages
        });
      }
    }
  });
};

module.exports = {
  initialize
};

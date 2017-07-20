const rest = require('request-promise');

const restOptions = {
  json: true
};

const initialize = ({
  server
}) => {
  const segment = 'status';

  server.method(segment, (id, next) => {
    const URL = `${global.Config.XIVDB.URL}/status`;
    console.log(URL);
    rest(URL, restOptions)
      .then((statuses) => {
        const response = {};
        statuses.forEach((status) => {
          response[status.id] = {
            Name: {
              Chinese: status.name_cns,
              Korean: status.name_ko,
              English: status.name_en,
              French: status.name_fr,
              German: status.name_de,
              Japanese: status.name_ja
            },
            CompanyAction: false
          };
        });
        process.nextTick(() => next(null, response));
      })
      .catch((err) => {
        process.nextTick(() => next(err));
      });
  }, {
    cache: {
      cache: 'redisCache',
      expiresIn: 30 * 24 * 60 * 60 * 1000,
      staleIn: 12 * 60 * 60 * 1000,
      segment,
      generateTimeout: 5000,
      staleTimeout: 1
    },
    generateKey: (params) => {
      return Object.keys(params).map((key) => params[key]).join('-');
    }
  });
};

module.exports = {
  initialize
};

require('babel-register');

if (process.env.NEW_RELIC_APP_NAME && process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}

global.Config = {
  mongo: {
    host: process.env.MONGO_HOST || '127.0.0.1'
  },
  LimiterOptions: {
    redis: {
      host: '127.0.0.1',
      port: 6379,
      options: {}
    },
    namespace: 'limiter',
    global: {
      limit: 250,
      duration: 30
    }
  },
  XIVDB: {
    URL: 'https://api.xivdb.com'
  },
  Languages: [
    'en',
    'fr',
    'de',
    'ja',
    'ko',
    'cn'
  ],
  PatchVersions: [
    '3.45'
  ],
  Platforms: [
    'x86',
    'x64'
  ],
  StructureTypes: [
    'Unknown',
    'ActorEntity',
    'ChatLogPointers',
    'Inventory',
    'Party',
    'PartyEntity',
    'PlayerInfo',
    'PlayerEntity',
    'Target',
    'StatusEntry',
    'EnmityEntry'
  ],
  OffsetKeys: [
    'GAMEMAIN',
    'TARGET',
    'CHATLOG',
    'CHARMAP',
    'PARTYMAP',
    'MAP',
    'PLAYERINFO',
    'AGRO',
    'AGRO_COUNT',
    'ENMITYMAP',
    'PARTYCOUNT'
  ]
};

const source = require('./src/');

source();

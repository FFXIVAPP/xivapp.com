require('babel-register');

if (process.env.NEW_RELIC_APP_NAME && process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}

global.Config = {
  mongo: {
    host: '159.203.17.181'
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
    'InventoryEntity',
    'ItemInfo',
    'PartyInfo',
    'PartyEntity',
    'PlayerInfo',
    'PlayerEntity',
    'TargetInfo',
    'StatusEntry',
    'EnmityEntry'
  ],
  SignatureKeys: [
    'GAMEMAIN',
    'TARGET',
    'CHATLOG',
    'CHARMAP',
    'PARTYMAP',
    'MAPINFO',
    'ZONEINFO',
    'PLAYERINFO',
    'AGRO',
    'AGRO_COUNT',
    'ENMITYMAP',
    'PARTYCOUNT'
  ],
  EnumerationKeys: [
    'Container',
    'ActionStatus',
    'Icon',
    'Job',
    'Sex',
    'Status',
    'TargetType',
    'Type'
  ]
};

const source = require('./src/');

source();

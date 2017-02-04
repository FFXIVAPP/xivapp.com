module.exports = {
  mongo: {
    host: '127.0.0.1'
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
    '3.45',
    '3.50'
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
    'PARTYCOUNT',
    'INVENTORY'
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

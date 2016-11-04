const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let ActorEntity = null;

const defaults = require('../defaults.js');
const indexed = defaults.indexed;
const unique = defaults.unique;

const actorentitySchema = new Schema({
  _id: defaults.guid(),
  v: {
    type: Number,
    default: 1
  },
  patchVersion: indexed(defaults.trimmedString()),
  platform: indexed(defaults.trimmedString()),
  keyedIndex: unique(indexed(defaults.trimmedString())),
  Name: Number,
  ID: Number,
  NPCID1: Number,
  NPCID2: Number,
  OwnerID: Number,
  Type: Number,
  TargetType: Number,
  GatheringStatus: Number,
  Distance: Number,
  X: Number,
  Z: Number,
  Y: Number,
  Heading: Number,
  HitBoxRadius: Number,
  Fate: Number,
  GatheringInvisible: Number,
  ModelID: Number,
  ActionStatus: Number,
  IsGM: Number,
  Icon: Number,
  Status: Number,
  ClaimedByID: Number,
  TargetID: Number,
  Job: Number,
  Level: Number,
  GrandCompany: Number,
  GrandCompanyRank: Number,
  Title: Number,
  HPCurrent: Number,
  HPMax: Number,
  MPCurrent: Number,
  MPMax: Number,
  TPCurrent: Number,
  GPCurrent: Number,
  GPMax: Number,
  CPCurrent: Number,
  CPMax: Number,
  IsCasting1: Number,
  IsCasting2: Number,
  CastingID: Number,
  CastingTargetID: Number,
  CastingProgress: Number,
  CastingTime: Number,
  DefaultBaseOffset: Number,
  DefaultStatOffset: Number,
  DefaultStatusEffectOffset: Number
}, {
  strict: false,
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});

module.exports = function ({
  models,
  connection
}) {
  if (!ActorEntity) {
    if (!models) {
      throw new Error('models required');
    }
    if (!connection) {
      throw new Error('connection required');
    }
    ActorEntity = connection.model('actorentity', actorentitySchema);
  }
  return ActorEntity;
};

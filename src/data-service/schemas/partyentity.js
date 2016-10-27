const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let PartyEntity = null;

const defaults = require('../defaults.js');
const indexed = defaults.indexed;
const unique = defaults.unique;

const partyentitySchema = new Schema({
  _id: defaults.guid(),
  v: {
    type: Number,
    default: 1
  },
  patchVersion: unique(indexed(defaults.trimmedString())),
  platform: indexed(defaults.trimmedString()),
  X: Number,
  Y: Number,
  Z: Number,
  ID: Number,
  Name: Number,
  Job: Number,
  Level: Number,
  HPCurrent: Number,
  HPMax: Number,
  MPCurrent: Number,
  MPMax: Number,
  StatusEffects: Number
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
  if (!PartyEntity) {
    if (!models) {
      throw new Error('models required');
    }
    if (!connection) {
      throw new Error('connection required');
    }
    PartyEntity = connection.model('partyentity', partyentitySchema);
  }
  return PartyEntity;
};

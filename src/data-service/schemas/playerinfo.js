const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let PlayerInfo = null;

const defaults = require('../defaults.js');
const indexed = defaults.indexed;
const unique = defaults.unique;

const playerinfoSchema = new Schema({
  _id: defaults.guid(),
  v: {
    type: Number,
    default: 1
  },
  patchVersion: unique(indexed(defaults.trimmedString())),
  platform: indexed(defaults.trimmedString()),
  EnmityCount: Number,
  EnmityStructure: Number
}, {
  strict: false,
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});

module.exports = function ({
  models,
  connection,
  logger
}) {
  if (!PlayerInfo) {
    if (!models) {
      throw new Error('models required');
    }
    if (!connection) {
      throw new Error('connection required');
    }
    PlayerInfo = connection.model('playerinfo', playerinfoSchema);
  }
  return PlayerInfo;
};

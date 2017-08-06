const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let ActorInfo = null;

const defaults = require('../defaults.js');
const indexed = defaults.indexed;
const unique = defaults.unique;

const actorinfoSchema = new Schema({
  _id: defaults.guid(),
  v: {
    type: Number,
    default: 1
  },
  patchVersion: indexed(defaults.trimmedString()),
  platform: indexed(defaults.trimmedString()),
  keyedIndex: unique(indexed(defaults.trimmedString())),
  latest: indexed({
    type: Boolean
  }),
  Size: Number
}, {
  strict: true,
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});

module.exports = function ({
  models,
  connection
}) {
  if (!ActorInfo) {
    if (!models) {
      throw new Error('models required');
    }
    if (!connection) {
      throw new Error('connection required');
    }
    ActorInfo = connection.model('actorinfo', actorinfoSchema);
  }
  return ActorInfo;
};

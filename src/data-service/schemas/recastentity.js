const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let RecastEntry = null;

const defaults = require('../defaults.js');
const indexed = defaults.indexed;
const unique = defaults.unique;

const recastentrySchema = new Schema({
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
  Category: Number,
  Type: Number,
  ID: Number,
  Icon: Number,
  ReadyPercent: Number,
  IsAvailable: Number,
  RemainingCost: Number,
  Amount: Number,
  InRange: Number
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
  if (!RecastEntry) {
    if (!models) {
      throw new Error('models required');
    }
    if (!connection) {
      throw new Error('connection required');
    }
    RecastEntry = connection.model('recastentry', recastentrySchema);
  }
  return RecastEntry;
};

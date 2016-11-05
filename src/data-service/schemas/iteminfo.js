const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let ItemInfo = null;

const defaults = require('../defaults.js');
const indexed = defaults.indexed;
const unique = defaults.unique;

const iteminfoSchema = new Schema({
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
  ID: Number,
  Slot: Number,
  Amount: Number,
  SB: Number,
  Durability: Number,
  GlamourID: Number,
  IsHQ: Number
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
  if (!ItemInfo) {
    if (!models) {
      throw new Error('models required');
    }
    if (!connection) {
      throw new Error('connection required');
    }
    ItemInfo = connection.model('iteminfo', iteminfoSchema);
  }
  return ItemInfo;
};

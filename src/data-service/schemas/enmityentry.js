const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let EnmityEntry = null;

const defaults = require('../defaults.js');
const indexed = defaults.indexed;
const unique = defaults.unique;

const enmityentrySchema = new Schema({
  _id: defaults.guid(),
  v: {
    type: Number,
    default: 1
  },
  patchVersion: indexed(defaults.trimmedString()),
  platform: indexed(defaults.trimmedString()),
  keyedIndex: unique(indexed(defaults.trimmedString())),
  ID: Number,
  Name: Number,
  Enmity: Number
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
  if (!EnmityEntry) {
    if (!models) {
      throw new Error('models required');
    }
    if (!connection) {
      throw new Error('connection required');
    }
    EnmityEntry = connection.model('enmityentry', enmityentrySchema);
  }
  return EnmityEntry;
};

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let StatusEntry = null;

const defaults = require('../defaults.js');
const indexed = defaults.indexed;
const unique = defaults.unique;

const statusentrySchema = new Schema({
  _id: defaults.guid(),
  v: {
    type: Number,
    default: 1
  },
  patchVersion: indexed(defaults.trimmedString()),
  platform: indexed(defaults.trimmedString()),
  keyedIndex: unique(indexed(defaults.trimmedString())),
  StatusID: Number,
  Stacks: Number,
  Duration: Number,
  CasterID: Number
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
  if (!StatusEntry) {
    if (!models) {
      throw new Error('models required');
    }
    if (!connection) {
      throw new Error('connection required');
    }
    StatusEntry = connection.model('statusentry', statusentrySchema);
  }
  return StatusEntry;
};

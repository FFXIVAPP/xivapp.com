const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let StatusEntry = null;

const defaults = require('../defaults.js');
const indexed = defaults.indexed;
const unique = defaults.unique;

const hotbarentitySchema = new Schema({
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
  Name: Number,
  KeyBinds: Number,
  ID: Number
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
  if (!StatusEntry) {
    if (!models) {
      throw new Error('models required');
    }
    if (!connection) {
      throw new Error('connection required');
    }
    StatusEntry = connection.model('hotbarentity', hotbarentitySchema);
  }
  return StatusEntry;
};

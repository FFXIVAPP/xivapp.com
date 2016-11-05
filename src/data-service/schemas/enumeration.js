const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let Enumeration = null;

const defaults = require('../defaults.js');
const indexed = defaults.indexed;
const unique = defaults.unique;

const enumerationSchema = new Schema({
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
  Key: String
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
  if (!Enumeration) {
    if (!models) {
      throw new Error('models required');
    }
    if (!connection) {
      throw new Error('connection required');
    }
    Enumeration = connection.model('enumeration', enumerationSchema);
  }
  return Enumeration;
};

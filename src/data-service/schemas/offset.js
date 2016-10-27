const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let Offset = null;

const defaults = require('../defaults.js');
const indexed = defaults.indexed;
const unique = defaults.unique;

const offsetSchema = new Schema({
  _id: defaults.guid(),
  v: {
    type: Number,
    default: 1
  },
  patchVersion: indexed(defaults.trimmedString()),
  platform: indexed(defaults.trimmedString()),
  keyedIndex: unique(indexed(defaults.trimmedString())),
  Key: indexed(defaults.trimmedString()),
  Value: defaults.trimmedString(),
  RegularExpress: defaults.trimmedString(),
  SigScanAddress: defaults.trimmedString(),
  ASMSignature: Boolean,
  PointerPath: [
    Number
  ],
  Notes: [
    String
  ]
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
  if (!Offset) {
    if (!models) {
      throw new Error('models required');
    }
    if (!connection) {
      throw new Error('connection required');
    }
    Offset = connection.model('offset', offsetSchema);
  }
  return Offset;
};

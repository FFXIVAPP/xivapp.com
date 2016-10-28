const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let TargetInfo = null;

const defaults = require('../defaults.js');
const indexed = defaults.indexed;
const unique = defaults.unique;

const targetinfoSchema = new Schema({
  _id: defaults.guid(),
  v: {
    type: Number,
    default: 1
  },
  patchVersion: unique(indexed(defaults.trimmedString())),
  platform: indexed(defaults.trimmedString()),
  HateStructure: Number,
  MouseOver: Number,
  Focus: Number,
  Previous: Number,
  Current: Number,
  CurrentID: Number,
  Size: Number
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
  if (!TargetInfo) {
    if (!models) {
      throw new Error('models required');
    }
    if (!connection) {
      throw new Error('connection required');
    }
    TargetInfo = connection.model('targetinfo', targetinfoSchema);
  }
  return TargetInfo;
};

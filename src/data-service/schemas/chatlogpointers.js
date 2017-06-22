const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let ChatLogPointers = null;

const defaults = require('../defaults.js');
const indexed = defaults.indexed;
const unique = defaults.unique;

const chatlogpointersSchema = new Schema({
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
  OffsetArrayStart: Number,
  OffsetArrayPos: Number,
  OffsetArrayEnd: Number,
  LogStart: Number,
  LogNext: Number,
  LogEnd: Number
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
  if (!ChatLogPointers) {
    if (!models) {
      throw new Error('models required');
    }
    if (!connection) {
      throw new Error('connection required');
    }
    ChatLogPointers = connection.model('chatlogpointers', chatlogpointersSchema);
  }
  return ChatLogPointers;
};

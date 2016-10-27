const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let Inventory = null;

const defaults = require('../defaults.js');
const indexed = defaults.indexed;
const unique = defaults.unique;

const inventorySchema = new Schema({
  _id: defaults.guid(),
  v: {
    type: Number,
    default: 1
  },
  patchVersion: unique(indexed(defaults.trimmedString())),
  platform: indexed(defaults.trimmedString()),
  ContainerAmount: Number,
  ID: Number,
  Slot: Number,
  ItemAmount: Number,
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
  if (!Inventory) {
    if (!models) {
      throw new Error('models required');
    }
    if (!connection) {
      throw new Error('connection required');
    }
    Inventory = connection.model('inventory', inventorySchema);
  }
  return Inventory;
};

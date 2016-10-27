const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let InventoryEntity = null;

const defaults = require('../defaults.js');
const indexed = defaults.indexed;
const unique = defaults.unique;

const inventoryentitySchema = new Schema({
  _id: defaults.guid(),
  v: {
    type: Number,
    default: 1
  },
  patchVersion: unique(indexed(defaults.trimmedString())),
  platform: indexed(defaults.trimmedString()),
  Amount: Number
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
  if (!InventoryEntity) {
    if (!models) {
      throw new Error('models required');
    }
    if (!connection) {
      throw new Error('connection required');
    }
    InventoryEntity = connection.model('inventoryentity', inventoryentitySchema);
  }
  return InventoryEntity;
};

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let User = null;

const defaults = require('../defaults.js');

const userSchema = new Schema({
  _id: defaults.guid(),
  v: {
    type: Number,
    default: 1
  }
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
  if (!User) {
    if (!models) {
      throw new Error('models required');
    }
    if (!connection) {
      throw new Error('connection required');
    }
    User = connection.model('user', userSchema);
  }
  return User;
};

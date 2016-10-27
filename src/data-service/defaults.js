const uuid = require('uuid');
const moment = require('moment');

module.exports = {
  date: () => {
    return {
      type: Date,
      default: () => {
        return new Date(moment.utc().format());
      }
    };
  },
  guid: () => {
    return {
      type: String,
      lowercase: true,
      trim: true,
      default: () => {
        return uuid.v4();
      }
    };
  },
  indexed: (object) => {
    return {
      ...object,
      index: true
    };
  },
  unique: (object) => {
    return {
      ...object,
      unique: true
    };
  },
  trimmedString: () => {
    return {
      type: String,
      trim: true
    };
  }
};

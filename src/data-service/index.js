const mongoose = require('mongoose');
const Promise = require('bluebird');

let savedConnection = null;

const ActorEntity = require('./schemas/actorentity.js');
const ChatLogPointers = require('./schemas/chatlogpointers.js');
const Inventory = require('./schemas/inventory.js');
const Party = require('./schemas/party.js');
const PartyEntity = require('./schemas/partyentity.js');
const PlayerInfo = require('./schemas/playerinfo.js');
const PlayerEntity = require('./schemas/playerentity.js');
const Target = require('./schemas/target.js');
const Signature = require('./schemas/signature.js');
const StatusEntry = require('./schemas/statusentry.js');
const EnmityEntry = require('./schemas/enmityentry.js');

const SCHEMAS = {
  ActorEntity,
  ChatLogPointers,
  Inventory,
  Party,
  PartyEntity,
  PlayerInfo,
  PlayerEntity,
  Target,
  Signature,
  StatusEntry,
  EnmityEntry
};

class DataService {
  constructor({
    config = {},
    logger = console
  }) {
    this.config = config;
    this.logger = logger;
  }
  ensureConnection() {
    return new Promise((resolve, reject) => {
      if (savedConnection) {
        return resolve(savedConnection);
      }
      const options = {
        db: {
          w: 1
        },
        server: {
          poolSize: 5,
          auto_reconnect: true,
          socketOptions: {
            connectTimeoutMS: 60000,
            keepAlive: 60000,
            socketTimeoutMS: 60000
          }
        }
      };
      const connection = mongoose.createConnection(`mongodb://${this.config.host}:${27017}/xivapp`, options, (err) => {
        if (err) {
          return reject(err);
        }
        const models = {
          logger: this.logger
        };
        Object.keys(SCHEMAS).forEach((type) => {
          models[type] = SCHEMAS[`${type}`]({
            models,
            connection,
            logger: this.logger
          });
        });
        savedConnection = models;
        return resolve(savedConnection);
      });
    });
  }
}

module.exports = DataService;

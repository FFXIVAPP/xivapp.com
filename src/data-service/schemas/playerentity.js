const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let PlayerEntity = null;

const defaults = require('../defaults.js');
const indexed = defaults.indexed;
const unique = defaults.unique;

const playerentitySchema = new Schema({
  _id: defaults.guid(),
  v: {
    type: Number,
    default: 1
  },
  patchVersion: unique(indexed(defaults.trimmedString())),
  platform: indexed(defaults.trimmedString()),
  Name: Number,
  JobID: Number,
  PGL: Number,
  GLD: Number,
  MRD: Number,
  ARC: Number,
  LNC: Number,
  THM: Number,
  CNJ: Number,
  CPT: Number,
  BSM: Number,
  ARM: Number,
  GSM: Number,
  LTW: Number,
  WVR: Number,
  ALC: Number,
  CUL: Number,
  MIN: Number,
  BTN: Number,
  FSH: Number,
  ACN: Number,
  ROG: Number,
  MCH: Number,
  DRK: Number,
  AST: Number,
  PGL_CurrentEXP: Number,
  GLD_CurrentEXP: Number,
  MRD_CurrentEXP: Number,
  ARC_CurrentEXP: Number,
  LNC_CurrentEXP: Number,
  THM_CurrentEXP: Number,
  CNJ_CurrentEXP: Number,
  CPT_CurrentEXP: Number,
  BSM_CurrentEXP: Number,
  ARM_CurrentEXP: Number,
  GSM_CurrentEXP: Number,
  LTW_CurrentEXP: Number,
  WVR_CurrentEXP: Number,
  ALC_CurrentEXP: Number,
  CUL_CurrentEXP: Number,
  MIN_CurrentEXP: Number,
  BTN_CurrentEXP: Number,
  FSH_CurrentEXP: Number,
  ACN_CurrentEXP: Number,
  ROG_CurrentEXP: Number,
  MCH_CurrentEXP: Number,
  DRK_CurrentEXP: Number,
  AST_CurrentEXP: Number,
  BaseStrength: Number,
  BaseDexterity: Number,
  BaseVitality: Number,
  BaseIntelligence: Number,
  BaseMind: Number,
  BasePiety: Number,
  Strength: Number,
  Dexterity: Number,
  Vitality: Number,
  Intelligence: Number,
  Mind: Number,
  Piety: Number,
  HPMax: Number,
  MPMax: Number,
  TPMax: Number,
  GPMax: Number,
  CPMax: Number,
  Accuracy: Number,
  CriticalHitRate: Number,
  Determination: Number,
  Parry: Number,
  Defense: Number,
  MagicDefense: Number,
  AttackPower: Number,
  SkillSpeed: Number,
  SpellSpeed: Number,
  AttackMagicPotency: Number,
  HealingMagicPotency: Number,
  FireResistance: Number,
  IceResistance: Number,
  WindResistance: Number,
  EarthResistance: Number,
  LightningResistance: Number,
  WaterResistance: Number,
  SlashingResistance: Number,
  PiercingResistance: Number,
  BluntResistance: Number,
  Craftmanship: Number,
  Control: Number,
  Gathering: Number,
  Perception: Number
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
  if (!PlayerEntity) {
    if (!models) {
      throw new Error('models required');
    }
    if (!connection) {
      throw new Error('connection required');
    }
    PlayerEntity = connection.model('playerentity', playerentitySchema);
  }
  return PlayerEntity;
};

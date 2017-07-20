const rest = require('request-promise');

const restOptions = {
  json: true
};

const columns = [
  'id',
  'name_ja',
  'name_en',
  'name_fr',
  'name_de',
  'name_cns',
  'help_ja',
  'help_en',
  'help_fr',
  'help_de',
  'help_cns',
  'icon',
  'level',
  'classjob_category',
  'classjob',
  'spell_group',
  'can_target_self',
  'can_target_party',
  'can_target_friendly',
  'can_target_hostile',
  'can_target_dead',
  'status_required',
  'status_gain_self',
  'cost',
  'cost_hp',
  'cost_mp',
  'cost_tp',
  'cost_cp',
  'cast_range',
  'cast_time',
  'recast_time',
  'is_in_game',
  'is_trait',
  'is_pvp',
  'is_target_area',
  'action_category',
  'action_combo',
  'action_proc_status',
  'action_timeline_hit',
  'action_timeline_use',
  'action_data',
  'effect_range',
  'type'
];

const ActionPotencyRegEx = /potency of (\d+)/gi;
const ActionOverTimePotencyRegEx = /potency: ?(\d+)/gi;
const DurationRegEx = /duration: ?(\d+)/gi;

const initialize = ({
  server
}) => {
  const segment = 'action';

  server.method(segment, (id, next) => {
    const URL = `${Config.XIVDB.URL}/action?columns=${columns.join(',')}`;
    console.log(URL);
    rest(URL, restOptions)
      .then((actions) => {
        const response = {};
        actions.forEach((action) => {
          const mapped = {
            Name: {
              Chinese: action.name_cns,
              Korean: action.name_ko,
              English: action.name_en,
              French: action.name_fr,
              German: action.name_de,
              Japanese: action.name_ja
            },
            Icon: action.icon,
            Level: action.level,
            ClassJobCategory: action.classjob_category,
            ClassJob: action.classjob,
            SpellGroup: action.spell_group,
            CanTargetSelf: action.can_target_self,
            CanTargetParty: action.can_target_party,
            CanTargetFriendly: action.can_target_friendly,
            CanTargetHostile: action.can_target_hostile,
            CanTargetDead: action.can_target_dead,
            StatusRequired: action.status_required,
            StatusGainSelf: action.status_gain_self,
            Cost: action.cost,
            CostHP: action.cost_hp,
            CostMP: action.cost_mp,
            CostTP: action.cost_tp,
            CostCP: action.cost_cp,
            CastRange: action.cast_range,
            CastTime: action.cast_time,
            RecastTime: action.recast_time,
            IsInGame: action.is_in_game,
            IsTrait: action.is_trait,
            IsPvp: action.is_pvp,
            IsTargetArea: action.is_target_area,
            ActionCategory: action.action_category,
            ActionCombo: action.action_combo,
            ActionProcStatus: action.action_proc_status,
            ActionTimelineHit: action.action_timeline_hit,
            ActionTimelineUse: action.action_timeline_use,
            ActionData: action.action_data,
            EffectRange: action.effect_range,
            Type: action.type,
            Potency: 0,
            OverTimePotency: 0,
            Duration: 0.0,
            IsHealingOverTime: false,
            IsDamageOverTime: false,
            HasNoInitialResult: false
          };

          const help = action.help_en;

          const actionPotency = ActionPotencyRegEx.exec(help);
          const actionOverTimePotency = ActionOverTimePotencyRegEx.exec(help);
          const duration = DurationRegEx.exec(help);

          if (actionPotency) {
            mapped.Potency = parseInt(actionPotency[1], 10);
          }
          if (actionOverTimePotency) {
            mapped.OverTimePotency = parseInt(actionOverTimePotency[1], 10);
          }
          if (duration) {
            mapped.Duration = parseFloat(duration[1]);
          }

          if (help.includes('healing over time') && actionOverTimePotency && duration) {
            mapped.IsHealingOverTime = true;
          }
          if (help.includes('damage over time') && actionOverTimePotency && duration) {
            mapped.IsDamageOverTime = true;
          }

          const actionName = action.name_en.toLowerCase();

          if (actionName.includes('bio') || actionName.includes('regen') || actionName.includes('whispering')) {
            mapped.HasNoInitialResult = true;
          }

          response[action.id] = mapped;
        });
        process.nextTick(() => next(null, response));
      })
      .catch((err) => {
        process.nextTick(() => next(err));
      });
  }, {
    cache: {
      cache: 'redisCache',
      expiresIn: 30 * 24 * 60 * 60 * 1000,
      staleIn: 24 * 60 * 60 * 1000,
      segment,
      generateTimeout: 5000,
      staleTimeout: 1
    },
    generateKey: (params) => {
      return Object.keys(params).map((key) => params[key]).join('-');
    }
  });
};

module.exports = {
  initialize
};

import { Skilltree } from "../models/Skilltree";
import { Skills } from "./Skills";
import { Fire, FireDefault } from "../models/skills/Fire";
import { Skill } from "../models/Skill";
import { LevelRule } from "../models/LevelRule";
import { Behavior, BehaviorDefault } from "../models/skills/Behavior";
import { Backpack, BackpackDefault } from "../models/skills/Backpack";
import { Control, ControlDefault } from "../models/skills/Control";
import { Damage, DamageDefault } from "../models/skills/Damage";
import { Heal, HealDefault } from "../models/skills/Heal";
import { HealthBoost, HealthBoostDefault } from "../models/skills/HealthBoost";
import { Knockback, KnockbackDefault } from "../models/skills/Knockback";
import { Lightning, LightningDefault } from "../models/skills/Lightning";
import { Pickup, PickupDefault } from "../models/skills/Pickup";
import { Poison, PoisonDefault } from "../models/skills/Poison";
import { Ranged, RangedDefault } from "../models/skills/Ranged";
import { Ride, RideDefault } from "../models/skills/Ride";
import { Shield, ShieldDefault } from "../models/skills/Shield";
import { Slow, SlowDefault } from "../models/skills/Slow";
import { Sprint, SprintDefault } from "../models/skills/Sprint";
import { Stomp, StompDefault } from "../models/skills/Stomp";
import { Thorns, ThornsDefault } from "../models/skills/Thorns";
import { Wither, WitherDefault } from "../models/skills/Wither";
import { Beacon, BeaconDefault } from "../models/skills/Beacon";
import { logging } from "selenium-webdriver";
import { MobTypes } from "./MobTypes";
import Level = logging.Level;

export class SkilltreeLoader {
  static loadSkilltree(data: any): Skilltree {
    if ((!data.Name && !data.name) || !(data.Name != "" || data.name != "")) {
      return null;
    }
    let skilltree: Skilltree = {id: data.ID || data.Id || data.id, skills: {}, mobtypes: []};
    skilltree.permission = data.permission || data.Permission || "";
    skilltree.name = data.name || data.Name || skilltree.id;
    skilltree.description = data.description || data.Description || [];


    skilltree.skills = SkilltreeLoader.loadSkills(data.skills || data.Skills);
    skilltree.mobtypes = SkilltreeLoader.loadMobTypes(data.mobtypes || data.mobTypes || data.Mobtypes || data.MobTypes);

    return skilltree;
  }

  static loadMobTypes(data: any) {
    let types = [];
    if (Array.isArray(data)) {
      data.forEach(name => {
        if (MobTypes.indexOf(name) >= 0) {
          types.push(name)
        }
      })
    }
    return types;
  }

  static loadSkills(data: any) {
    let skills = {};
    Skills.forEach(skillInfo => {
      if (data[skillInfo.name]) {
        let upgrades = [];
        Object.keys(data[skillInfo.name].upgrades || data[skillInfo.name].Upgrades).forEach(key => {
          let rule = SkilltreeLoader.loadLevelRule(key);
          let upgrade = SkilltreeLoader.SkillLoader[skillInfo.name](data[skillInfo.name].Upgrades[key]);
          upgrade.rule = rule;
          upgrades.push(upgrade);
        });
        let skill = new Skill();
        skill.upgrades = upgrades;
        if (skill) {
          skills[skillInfo.name] = skill;
        }
      }
    });
    return skills;
  }

  static loadLevelRule(rule: string): LevelRule {
    const regex = /(%\d+)|(<\d+)|(>\d+)/g;
    let m;

    let levelRule: LevelRule = {};

    let dynamic: boolean = false;

    while ((m = regex.exec(rule)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      m.forEach((match) => {
        if (match) {
          if (match.startsWith("%")) {
            let m = match.substr(1);
            let modulo = parseInt(m);
            if (!isNaN(modulo)) {
              levelRule.every = modulo;
            } else {
              levelRule.every = 1;
            }
            dynamic = true;
          } else if (match.startsWith(">")) {
            let s = match.substr(1);
            let start = parseInt(s);
            if (!isNaN(start)) {
              levelRule.minimum = start;
            }
            dynamic = true;
          } else if (match.startsWith("%")) {
            let e = match.substr(1);
            let end = parseInt(e);
            if (!isNaN(end)) {
              levelRule.limit = end;
            }
            dynamic = true;
          }
        }
      });
    }
    if (!dynamic) {
      levelRule.exact = [];
      let levels = rule.split(',');
      levels.forEach(l => {
        let level = parseInt(l);
        if (!isNaN(level)) {
          levelRule.exact.push(level)
        }
      })
    }
    return levelRule;
  }

  static SkillLoader = {
    Backpack(data: any): Backpack {
      let backpack: Backpack = Object.assign({}, BackpackDefault);
      setDefault(backpack, "rows", data.rows || data.Rows);
      setDefault(backpack, "drop", data.drop || data.Drop);
      return backpack;
    },

    Beacon(data: any): Beacon {
      let beacon: Beacon = Object.assign({}, BeaconDefault);
      setDefault(beacon, "range", data.range || data.Range);
      setDefault(beacon, "duration", data.duration || data.Duration);
      setDefault(beacon, "count", data.count || data.Count);
      if (data.Buffs) {
        setDefault(beacon.buffs.Absorption, "active", data.Buffs.Absorption ? data.Buffs.Absorption.active : false);
        setDefault(beacon.buffs.Absorption, "level", data.Buffs.Absorption ? data.Buffs.Absorption.level : false);

        setDefault(beacon.buffs.FireResistance, "active", data.Buffs.FireResistance ? data.Buffs.FireResistance.active : false);
        setDefault(beacon.buffs.FireResistance, "level", data.Buffs.FireResistance ? data.Buffs.FireResistance.level : false);

        setDefault(beacon.buffs.Haste, "active", data.Buffs.Haste ? data.Buffs.Haste.active : false);
        setDefault(beacon.buffs.Haste, "level", data.Buffs.Haste ? data.Buffs.Haste.level : false);

        setDefault(beacon.buffs.HealthBoost, "active", data.Buffs.HealthBoost ? data.Buffs.HealthBoost.active : false);
        setDefault(beacon.buffs.HealthBoost, "level", data.Buffs.HealthBoost ? data.Buffs.HealthBoost.level : false);

        setDefault(beacon.buffs.JumpBoost, "active", data.Buffs.JumpBoost ? data.Buffs.JumpBoost.active : false);
        setDefault(beacon.buffs.JumpBoost, "level", data.Buffs.JumpBoost ? data.Buffs.JumpBoost.level : false);

        setDefault(beacon.buffs.Luck, "active", data.Buffs.Luck ? data.Buffs.Luck.active : false);
        setDefault(beacon.buffs.Luck, "level", data.Buffs.Luck ? data.Buffs.Luck.level : false);

        setDefault(beacon.buffs.NightVision, "active", data.Buffs.NightVision ? data.Buffs.NightVision.active : false);
        setDefault(beacon.buffs.NightVision, "level", data.Buffs.NightVision ? data.Buffs.NightVision.level : false);

        setDefault(beacon.buffs.Resistance, "active", data.Buffs.Resistance ? data.Buffs.Resistance.active : false);
        setDefault(beacon.buffs.Resistance, "level", data.Buffs.Resistance ? data.Buffs.Resistance.level : false);

        setDefault(beacon.buffs.Speed, "active", data.Buffs.Speed ? data.Buffs.Speed.active : false);
        setDefault(beacon.buffs.Speed, "level", data.Buffs.Speed ? data.Buffs.Speed.level : false);

        setDefault(beacon.buffs.Strength, "active", data.Buffs.Strength ? data.Buffs.Strength.active : false);
        setDefault(beacon.buffs.Strength, "level", data.Buffs.Strength ? data.Buffs.Strength.level : false);

        setDefault(beacon.buffs.WaterBreathing, "active", data.Buffs.WaterBreathing ? data.Buffs.WaterBreathing.active : false);
        setDefault(beacon.buffs.WaterBreathing, "level", data.Buffs.WaterBreathing ? data.Buffs.WaterBreathing.level : false);
      }

      console.log(beacon);

      return beacon;
    },

    Behavior(data: any): Behavior {
      let behavior: Behavior = Object.assign({}, BehaviorDefault);
      setDefault(behavior, "aggro", data.aggro || data.Aggro);
      setDefault(behavior, "duel", data.duel || data.Duel);
      setDefault(behavior, "farm", data.farm || data.Farm);
      setDefault(behavior, "friend", data.friend || data.Friend);
      setDefault(behavior, "raid", data.raid || data.Raid);
      return behavior;
    },

    Control(data: any): Control {
      let control: Control = Object.assign({}, ControlDefault);
      setDefault(control, "active", data.active || data.Active);
      return control;
    },

    Damage(data: any): Damage {
      let damage: Damage = Object.assign({}, DamageDefault);
      setDefault(damage, "damage", data.damage || data.Damage);
      return damage;
    },

    Fire(data: any): Fire {
      let fire: Fire = Object.assign({}, FireDefault);
      setDefault(fire, "chance", data.chance || data.Chance);
      setDefault(fire, "duration", data.duration || data.Duration);
      return fire;
    },

    Heal(data: any): Heal {
      let heal: Heal = Object.assign({}, HealDefault);
      setDefault(heal, "timer", data.timer || data.Timer);
      setDefault(heal, "health", data.health || data.Health);
      return heal;
    },

    HealthBoost(data: any): HealthBoost {
      let healthBoost: HealthBoost = Object.assign({}, HealthBoostDefault);
      setDefault(healthBoost, "health", data.health || data.Health);
      return healthBoost;
    },

    Knockback(data: any): Knockback {
      let knockback: Knockback = Object.assign({}, KnockbackDefault);
      setDefault(knockback, "chance", data.chance || data.Chance);
      return knockback;
    },

    Lightning(data: any): Lightning {
      let lightning: Lightning = Object.assign({}, LightningDefault);
      setDefault(lightning, "chance", data.chance || data.Chance);
      setDefault(lightning, "damage", data.damage || data.Damage);
      return lightning;
    },

    Pickup(data: any): Pickup {
      let pickup: Pickup = Object.assign({}, PickupDefault);
      setDefault(pickup, "range", data.Range);
      setDefault(pickup, "exp", data.exp || data.Exp || data.EXP);
      return pickup;
    },

    Poison(data: any): Poison {
      let poison: Poison = Object.assign({}, PoisonDefault);
      setDefault(poison, "chance", data.chance || data.Chance);
      setDefault(poison, "duration", data.duration || data.Duration);
      return poison;
    },

    Ranged(data: any): Ranged {
      let ranged: Ranged = Object.assign({}, RangedDefault);
      setDefault(ranged, "damage", data.damage || data.Damage);
      setDefault(ranged, "rate", data.rate || data.Rate);
      setDefault(ranged, "projectile", data.projectile || data.Projectile);
      return ranged;
    },

    Ride(data: any): Ride {
      let ride: Ride = Object.assign({}, RideDefault);
      setDefault(ride, "speed", data.speed || data.Speed);
      setDefault(ride, "jumpHeight", data.jumpheight || data.Jumpheight || data.jumpHeight || data.JumpHeight);
      setDefault(ride, "canFly", data.canfly || data.Canfly || data.canFly || data.CanFly);
      return ride;
    },

    Shield(data: any): Shield {
      let shield: Shield = Object.assign({}, ShieldDefault);
      setDefault(shield, "chance", data.chance || data.Chance);
      setDefault(shield, "redirect", data.redirect || data.Redirect);
      return shield;
    },

    Slow(data: any): Slow {
      let slow: Slow = Object.assign({}, SlowDefault);
      setDefault(slow, "chance", data.chance || data.Chance);
      setDefault(slow, "duration", data.duration || data.Duration);
      return slow;
    },

    Sprint(data: any): Sprint {
      let sprint: Sprint = Object.assign({}, SprintDefault);
      setDefault(sprint, "active", data.active || data.Active);
      return sprint;
    },

    Stomp(data: any): Stomp {
      let slow: Stomp = Object.assign({}, StompDefault);
      setDefault(slow, "chance", data.chance || data.Chance);
      setDefault(slow, "damage", data.damage || data.Damage);
      return slow;
    },

    Thorns(data: any): Thorns {
      let slow: Thorns = Object.assign({}, ThornsDefault);
      setDefault(slow, "chance", data.chance || data.Chance);
      setDefault(slow, "reflection", data.reflection || data.Reflection);
      return slow;
    },

    Wither(data: any): Wither {
      let slow: Wither = Object.assign({}, WitherDefault);
      setDefault(slow, "chance", data.chance || data.Chance);
      setDefault(slow, "duration", data.duration || data.Duration);
      return slow;
    }
  }
}


function setDefault(object: object, field: string, value: any) {
  if (typeof value !== "undefined") {
    object[field] = value;
  }
}

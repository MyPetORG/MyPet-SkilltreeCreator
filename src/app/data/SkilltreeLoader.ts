import { Skilltree } from "../models/Skilltree";
import { Skills } from "./Skills";
import { Fire } from "../models/skills/Fire";
import { Skill } from "../models/Skill";
import { LevelRule } from "../models/LevelRule";
import { Behavior } from "../models/skills/Behavior";
import { Backpack } from "../models/skills/Backpack";
import { Control } from "../models/skills/Control";
import { Damage } from "../models/skills/Damage";
import { Heal } from "../models/skills/Heal";
import { HealthBoost } from "../models/skills/HealthBoost";
import { Knockback } from "../models/skills/Knockback";
import { Lightning } from "../models/skills/Lightning";
import { Pickup } from "../models/skills/Pickup";
import { Poison } from "../models/skills/Poison";
import { Ranged } from "../models/skills/Ranged";
import { Ride } from "../models/skills/Ride";
import { Shield } from "../models/skills/Shield";
import { Slow } from "../models/skills/Slow";
import { Sprint } from "../models/skills/Sprint";
import { Stomp } from "../models/skills/Stomp";
import { Thorns } from "../models/skills/Thorns";
import { Wither } from "../models/skills/Wither";
import { Beacon } from "../models/skills/Beacon";
import { logging } from "selenium-webdriver";
import Level = logging.Level;

export class SkilltreeLoader {
  static loadSkilltree(data: any): Skilltree {
    if (!data.Name || data.Name === "") {
      return null;
    }
    let skilltree: Skilltree = {name: data.Name};
    skilltree.permission = data.Permission || "";
    skilltree.displayName = data.DisplayName || data.Name;
    skilltree.description = data.Description || [];


    skilltree.skills = SkilltreeLoader.loadSkills(data.Skills);
    skilltree.mobtypes = SkilltreeLoader.loadMobTypes(data.MobTypes);

    return skilltree;
  }

  static loadMobTypes(data: any) {
    let types = [];
    if (Array.isArray(data)) {
      data.forEach(name => {
        if (Skills.indexOf(name) >= 0) {
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
        Object.keys(data[skillInfo.name].Upgrades).forEach(key => {
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
              levelRule.every
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
      let backpack: Backpack = {};
      backpack.rows = data.rows || 0;
      backpack.drop = data.drop || null;
      return backpack;
    },

    Beacon(data: any): Beacon {
      let beacon: Beacon = {};
      beacon.range = data.Range || 0;
      beacon.duration = data.Duration || 0;
      beacon.count = data.Count || 0;
      if (data.Buffs) {
        beacon.buffs = {
          Absorption: {
            active: data.Buffs.Absorption.active || null,
            level: data.Buffs.Absorption.level || 0
          },
          FireResistance: {
            active: data.Buffs.FireResistance.active || null,
            level: data.Buffs.FireResistance.level || 0
          },
          Haste: {
            active: data.Buffs.Haste.active || null,
            level: data.Buffs.Haste.level || 0
          },
          HealthBoost: {
            active: data.Buffs.HealthBoost.active || null,
            level: data.Buffs.HealthBoost.level || 0
          },
          JumpBoost: {
            active: data.Buffs.JumpBoost.active || null,
            level: data.Buffs.JumpBoost.level || 0
          },
          Luck: {
            active: data.Buffs.Luck.active || null,
            level: data.Buffs.Luck.level || 0
          },
          NightVision: {
            active: data.Buffs.NightVision.active || null,
            level: data.Buffs.NightVision.level || 0
          },
          Resistance: {
            active: data.Buffs.Resistance.active || null,
            level: data.Buffs.Resistance.level || 0
          },
          Speed: {
            active: data.Buffs.Speed.active || null,
            level: data.Buffs.Speed.level || 0
          },
          Strength: {
            active: data.Buffs.Strength.active || null,
            level: data.Buffs.Strength.level || 0
          },
          WaterBreathing: {
            active: data.Buffs.WaterBreathing.active || null,
            level: data.Buffs.WaterBreathing.level || 0
          }
        };
      } else {
        //beacon.buffs = {}
      }
      return beacon;
    },

    Behavior(data: any): Behavior {
      let behavior: Behavior = {};
      behavior.aggro = data.Aggro || null;
      behavior.duel = data.Duel || null;
      behavior.farm = data.Farm || null;
      behavior.friend = data.Friend || null;
      behavior.raid = data.Raid || null;
      return behavior;
    },

    Control(data: any): Control {
      let control: Control = {};
      control.active = data.Active || null;
      return control;
    },

    Damage(data: any): Damage {
      let damage: Damage = {};
      damage.damage = data.Damage || 0;
      return damage;
    },

    Fire(data: any): Fire {
      let fire: Fire = {};
      fire.chance = data.Chance || 0;
      fire.duration = data.Duration || 0;
      return fire;
    },

    Heal(data: any): Heal {
      let heal: Heal = {};
      heal.timer = data.Timer || 0;
      heal.health = data.Health || 0;
      return heal;
    },

    HealthBoost(data: any): HealthBoost {
      let healthBoost: HealthBoost = {};
      healthBoost.health = data.Health || 0;
      return healthBoost;
    },

    Knockback(data: any): Knockback {
      let knockback: Knockback = {};
      knockback.chance = data.Chance || 0;
      return knockback;
    },

    Lightning(data: any): Lightning {
      let lightning: Lightning = {};
      lightning.chance = data.Chance || 0;
      lightning.damage = data.Damage || 0;
      return lightning;
    },

    Pickup(data: any): Pickup {
      let pickup: Pickup = {};
      pickup.range = data.Range || 0;
      pickup.exp = data.EXP || null;
      return pickup;
    },

    Poison(data: any): Poison {
      let poison: Poison = {};
      poison.chance = data.Chance || 0;
      poison.duration = data.Duration || 0;
      return poison;
    },

    Ranged(data: any): Ranged {
      let ranged: Ranged = {};
      ranged.damage = data.Damage || 0;
      ranged.rate = data.Rate || 0;
      ranged.projectile = data.Projectile || "Arrow";
      return ranged;
    },

    Ride(data: any): Ride {
      let ride: Ride = {};
      ride.speed = data.Speed || 0;
      ride.jumpHeight = data.JumpHeight || 0;
      ride.canFly = data.CanFly || null;
      return ride;
    },

    Shield(data: any): Shield {
      let shield: Shield = {};
      shield.chance = data.Chance || 0;
      shield.redirect = data.Redirect || 0;
      return shield;
    },

    Slow(data: any): Slow {
      let slow: Slow = {};
      slow.chance = data.Chance || 0;
      slow.duration = data.Duration || 0;
      return slow;
    },

    Sprint(data: any): Sprint {
      let sprint: Sprint = {};
      sprint.active = data.Active || 0;
      return sprint;
    },

    Stomp(data: any): Stomp {
      let slow: Stomp = {};
      slow.chance = data.Chance || 0;
      slow.damage = data.Damage || 0;
      return slow;
    },

    Thorns(data: any): Thorns {
      let slow: Thorns = {};
      slow.chance = data.Chance || 0;
      slow.reflection = data.Reflection || 0;
      return slow;
    },

    Wither(data: any): Wither {
      let slow: Wither = {};
      slow.chance = data.Chance || 0;
      slow.duration = data.Duration || 0;
      return slow;
    }
  }
}

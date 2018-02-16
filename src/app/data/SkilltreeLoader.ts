import { Skilltree } from "../models/Skilltree";
import { Skills } from "./Skills";
import { FireLoader } from "../models/skills/Fire";
import { LevelRule } from "../models/LevelRule";
import { BehaviorLoader } from "../models/skills/Behavior";
import { BackpackLoader } from "../models/skills/Backpack";
import { ControlLoader } from "../models/skills/Control";
import { DamageLoader } from "../models/skills/Damage";
import { HealLoader } from "../models/skills/Heal";
import { HealthBoostLoader } from "../models/skills/HealthBoost";
import { KnockbackLoader } from "../models/skills/Knockback";
import { LightningLoader } from "../models/skills/Lightning";
import { PickupLoader } from "../models/skills/Pickup";
import { PoisonLoader } from "../models/skills/Poison";
import { RangedLoader } from "../models/skills/Ranged";
import { RideLoader } from "../models/skills/Ride";
import { ShieldLoader } from "../models/skills/Shield";
import { SlowLoader } from "../models/skills/Slow";
import { SprintLoader } from "../models/skills/Sprint";
import { StompLoader } from "../models/skills/Stomp";
import { ThornsLoader } from "../models/skills/Thorns";
import { WitherLoader } from "../models/skills/Wither";
import { BeaconLoader } from "../models/skills/Beacon";
import { MobTypes } from "./MobTypes";
import { Upgrade } from "../models/Upgrade";

export class SkilltreeLoader {
  static loadSkilltree(data: any): Skilltree {
    let name = data.getProp("name");
    if (!name || name == "") {
      return null;
    }
    let skilltree: Skilltree = {id: data.getProp("id"), skills: {}, mobtypes: []};
    skilltree.permission = data.getProp("permission") || "";
    skilltree.name = data.getProp("name") || skilltree.id;
    skilltree.description = data.getProp("description") || [];


    skilltree.skills = SkilltreeLoader.loadSkills(data.getProp("skills"));
    skilltree.mobtypes = SkilltreeLoader.loadMobTypes(data.getProp("mobtypes"));

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

  static loadSkills(data: any): { [name: string]: Upgrade[] } {
    let skills = {};
    Skills.forEach(skillInfo => {
      if (data[skillInfo.name]) {
        skills[skillInfo.name] = [];
        Object.keys(data[skillInfo.name].getProp("upgrades")).forEach(key => {
          let rule = SkilltreeLoader.loadLevelRule(key);
          let upgrade = SkilltreeLoader.SkillLoader[skillInfo.name](data[skillInfo.name].getProp("upgrades")[key]);
          upgrade.rule = rule;
          skills[skillInfo.name].push(upgrade);
        });
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
    Backpack: BackpackLoader,
    Beacon: BeaconLoader,
    Behavior: BehaviorLoader,
    Control: ControlLoader,
    Damage: DamageLoader,
    Fire: FireLoader,
    Heal: HealLoader,
    HealthBoost: HealthBoostLoader,
    Knockback: KnockbackLoader,
    Lightning: LightningLoader,
    Pickup: PickupLoader,
    Poison: PoisonLoader,
    Ranged: RangedLoader,
    Ride: RideLoader,
    Shield: ShieldLoader,
    Slow: SlowLoader,
    Sprint: SprintLoader,
    Stomp: StompLoader,
    Thorns: ThornsLoader,
    Wither: WitherLoader,
  }
}


function setDefault(object: object, field: string, value: any) {
  if (typeof value !== "undefined") {
    object[field] = value;
  }
}

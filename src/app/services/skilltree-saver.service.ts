import { Injectable } from "@angular/core";
import { Skilltree } from "../models/Skilltree";
import { HttpClient } from "@angular/common/http";
import { LevelRule } from "../models/LevelRule";
import { Upgrade } from "../models/Upgrade";
import { SkillSaver } from "../data/SkillSaver";

@Injectable()
export class SkilltreeSaverService {

  constructor(private http: HttpClient) {
  }

  public saveSkilltrees(skilltrees: Skilltree[]) {
    let savedSkilltrees = [];

    skilltrees.forEach(skilltree => {
      let data: any = {ID: skilltree.id, Order: skilltree.order};
      if (skilltree.name) {
        data.Name = skilltree.name;
      }
      if (skilltree.permission) {
        data.Permission = skilltree.permission;
      }
      if (skilltree.icon) {
        data.Icon = skilltree.icon;
      }
      if (skilltree.description) {
        data.Description = skilltree.description.slice();
      }
      data.MobTypes = skilltree.mobtypes.slice(0);

      data.Skills = {};
      this.saveSkills(data.Skills, skilltree.skills);

      savedSkilltrees.push(data);
    });

    return this.http.post("/api/skilltrees/save", savedSkilltrees);
  }

  saveSkills(data: any, skills: { [name: string]: Upgrade[] }) {
    Object.keys(skills).forEach(key => {
      let upgrades = skills[key];
      upgrades.forEach(upgrade => {
        let rule = this.saveLevelRule(upgrade.rule);

        let saver = SkillSaver[key];
        if (saver) {
          let skillData = saver(upgrade);
          //if(Object.keys(skillData).length > 0) {
          if (!data[key]) {
            data[key] = {};
            data[key].Upgrades = {};
          }
          data[key].Upgrades[rule] = skillData;
          //}
        }
      });
    });
  }

  saveLevelRule(levelRule: LevelRule): string {
    if (levelRule.exact) {
      return levelRule.exact.join(',');
    }
    let rule = "%" + levelRule.every;
    if (levelRule.limit) {
      rule += "<" + levelRule.limit;
    }
    if (levelRule.minimum) {
      rule += ">" + levelRule.minimum;
    }
    return rule;
  }
}

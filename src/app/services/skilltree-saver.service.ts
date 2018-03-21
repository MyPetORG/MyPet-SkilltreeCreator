import { Injectable } from "@angular/core";
import { Skilltree } from "../models/skilltree";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LevelRule } from "../models/level-rule";
import { Upgrade } from "../models/upgrade";
import { SkillSaver } from "../data/skill-saver";
import { MobTypes } from "../data/mob-types";

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
      if (skilltree.requiredLevel) {
        data.RequiredLevel = skilltree.requiredLevel;
      }
      if (skilltree.maxLevel) {
        data.MaxLevel = skilltree.maxLevel;
      }
      if (skilltree.description) {
        data.Description = skilltree.description.slice();
      }
      data.MobTypes = this.saveMobTypes(skilltree.mobtypes.slice(0));

      data.Skills = {};
      this.saveSkills(data.Skills, skilltree.skills);

      savedSkilltrees.push(data);
    });

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post("/api/skilltrees/save", savedSkilltrees, {headers});
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

  saveMobTypes(mobtypes: string[]): string[] {
    if (mobtypes.length == MobTypes.length) {
      return ["*"]
    }
    if (mobtypes.length >= ~~(MobTypes.length * 0.75)) {
      let negativeTypes = MobTypes.filter(type => mobtypes.indexOf(type) == -1);
      negativeTypes.forEach((type, index) => negativeTypes[index] = "-" + type);
      return negativeTypes;
    }
    return mobtypes;
  }
}

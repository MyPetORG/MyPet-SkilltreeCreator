import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MobTypes } from '../data/mob-types';
import { SkillSaver } from '../data/skill-saver';
import { LevelRule } from '../models/level-rule';
import { Skilltree } from '../models/skilltree';
import { Upgrade } from '../models/upgrade';

@Injectable()
export class SkilltreeSaverService {

  constructor(private http: HttpClient) {
  }

  public saveSkilltrees(skilltrees: Skilltree[]) {
    let savedSkilltrees = [];

    skilltrees.forEach(skilltree => {
      let data: any = { ID: skilltree.id, Order: skilltree.order };
      if (skilltree.name) {
        data.Name = skilltree.name;
      }
      if (skilltree.requirements && skilltree.requirements.length > 0) {
        data.Requirements = skilltree.requirements;
      }
      if (skilltree.icon) {
        let icon: any = {};
        let save = false;
        if (skilltree.icon.material && skilltree.icon.material !== '') {
          icon.Material = skilltree.icon.material;
          save = true;
        }
        if (skilltree.icon.glowing) {
          icon.Glowing = skilltree.icon.glowing;
          save = true;
        }
        if (save) {
          data.Icon = icon;
        }
      }
      if (skilltree.inheritance && skilltree.inheritance.skilltree) {
        let inheritance: any = {};
        if (skilltree.inheritance.skilltree) {
          inheritance.Skilltree = skilltree.inheritance.skilltree;
        }
        data.Inheritance = inheritance;
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
      if (skilltree.weight && skilltree.weight != 1) {
        data.Weight = skilltree.weight;
      }
      let mobTypes = skilltree.mobtypes;
      if (!mobTypes) {
        mobTypes = ['*'];
      }
      data.MobTypes = this.saveMobTypes([...mobTypes]);

      data.Skills = {};
      this.saveSkills(data.Skills, skilltree.skills);
      this.saveNotifications(data, skilltree.messages);

      savedSkilltrees.push(data);
    });

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post('/api/skilltrees/save', savedSkilltrees, { headers });
  }

  saveNotifications(data: any, messages: { rule: LevelRule, content: string }[]) {
    let dataMessages: any = {};
    messages.forEach(message => {
      let rule = this.saveLevelRule(message.rule);
      dataMessages[rule] = message.content;
    });
    if (Object.keys(dataMessages).length > 0) {
      data.Notifications = dataMessages;
    }
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
    let rule = '%' + levelRule.every;
    if (levelRule.minimum) {
      rule += '>' + levelRule.minimum;
    }
    if (levelRule.limit) {
      rule += '<' + levelRule.limit;
    }
    return rule;
  }

  saveMobTypes(mobtypes: string[]): string[] {
    if (mobtypes.length == MobTypes.length) {
      return ['*'];
    }
    if (mobtypes.length >= ~~(MobTypes.length * 0.75)) {
      return MobTypes
        .filter(type => mobtypes.indexOf(type) == -1)
        .map(type => '-' + type);
    }
    return mobtypes;
  }
}

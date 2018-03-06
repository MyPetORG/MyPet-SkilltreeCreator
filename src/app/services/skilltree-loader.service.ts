import { Injectable } from "@angular/core";
import { Skilltree } from "../models/Skilltree";
import { SkillLoader } from "../data/SkillLoader";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Skills } from "../data/Skills";
import { LevelRule } from "../models/LevelRule";
import { Upgrade } from "../models/Upgrade";
import { of } from "rxjs/observable/of";
import { MobTypes } from "../data/MobTypes";

@Injectable()
export class SkilltreeLoaderService {

  constructor(private http: HttpClient) {
  }

  public loadSkilltrees() {
    return this.http.get("/api/skilltrees");
  }

  loadSkilltree(data: any): Observable<Skilltree> {
    let id = data.getProp("id");
    if (!id || id == "") {
      return Observable.throw({type: "INVALID", data: "NO ID"})
    }
    let skilltree: Skilltree = {id, skills: {}, mobtypes: []};
    skilltree.permission = data.getProp("permission") || "";
    skilltree.name = data.getProp("name") || skilltree.id;
    skilltree.description = data.getProp("description") || [];
    skilltree.order = data.getProp("order") || Number.MAX_SAFE_INTEGER;
    skilltree.icon = data.getProp("icon") || "";

    skilltree.skills = this.loadSkills(data.getProp("skills"));
    skilltree.mobtypes = this.loadMobTypes(data.getProp("mobtypes"));

    return of(skilltree);
  }

  loadMobTypes(data: any) {
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

  loadSkills(data: any): { [name: string]: Upgrade[] } {
    let skills = {};
    Skills.forEach(skillInfo => {
      if (data[skillInfo.id]) {
        skills[skillInfo.id] = [];
        Object.keys(data[skillInfo.id].getProp("upgrades")).forEach(key => {
          let rule = this.loadLevelRule(key);
          let upgrade = SkillLoader[skillInfo.id](data[skillInfo.id].getProp("upgrades")[key]);
          upgrade.rule = rule;
          skills[skillInfo.id].push(upgrade);
        });
      }
    });
    return skills;
  }

  loadLevelRule(rule: string): LevelRule {
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
        let level = parseInt(l.trim());
        if (!isNaN(level)) {
          levelRule.exact.push(level)
        }
      })
    }
    return levelRule;
  }
}

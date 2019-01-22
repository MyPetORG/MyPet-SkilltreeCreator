import { Observable, of, throwError as observableThrowError } from 'rxjs';
import { ErrorHandler, Injectable } from "@angular/core";
import { Skilltree } from "../models/skilltree";
import { SkillLoader } from "../data/skill-loader";
import { HttpClient } from "@angular/common/http";
import { Skills } from "../data/skills";
import { LevelRule } from "../models/level-rule";
import { Upgrade } from "../models/upgrade";
import { MobTypes } from "../data/mob-types";
import { ErrorReporterService } from "./error-reporter.service";

@Injectable()
export class SkilltreeLoaderService {

  constructor(
    private http: HttpClient,
    private errorReporter: ErrorHandler,
  ) {
  }

  public loadSkilltrees() {
    return this.http.get("/api/skilltrees");
  }

  loadSkilltree(data: any): Observable<Skilltree> {
    let id = data.getProp("ID");
    if (!id || id == "") {
      return observableThrowError({type: "INVALID", data: "NO ID"});
    }
    if (!id.match(/^[a-zA-Z0-9.-_]+$/)) {
      return observableThrowError({type: "INVALID", data: "INVALID ID"});
    }
    let skilltree: Skilltree = {id, skills: {}, mobtypes: [], messages: [], requirements: []};

    skilltree.name = data.getProp("Name") || skilltree.id;
    skilltree.description = data.getProp("Description") || [];
    skilltree.order = data.getPropAs("Order", "int");
    if (!skilltree.order && skilltree.order != 0) {
      skilltree.order = Number.MAX_SAFE_INTEGER;
    }
    skilltree.weight = data.getPropAs("Weight", "int") || 1;
    skilltree.requiredLevel = data.getPropAs("RequiredLevel", "int") || 0;
    skilltree.maxLevel = data.getPropAs("MaxLevel", "int") || 0;
    let icon: any = data.getProp("Icon") || {};
    skilltree.icon = {};
    skilltree.icon.material = icon.getPropAs("Material", "string") || "";
    if (skilltree.icon.material == "undefined") {
      skilltree.icon.material = ""; //TODO remove later (17.12.2018)
    }
    skilltree.icon.glowing = icon.getPropAs("Glowing", "bool") || false;
    let inheritance: any = data.getProp("Inheritance") || {};
    skilltree.inheritance = {};
    skilltree.inheritance.skilltree = inheritance.getPropAs("Skilltree", "string") || "";
    skilltree.requirements = data.getProp("Requirements") || [];
    let permission = data.getProp("Permission");
    if (permission) {
      skilltree.requirements.push("Permission:" + permission);
    }

    try {
      skilltree.skills = this.loadSkills(data.getProp("Skills"));
      skilltree.mobtypes = this.loadMobTypes(data.getProp("MobTypes"));
      skilltree.messages = this.loadNotifications(data.getProp("Notifications"));
    } catch (e) {
      (<ErrorReporterService>this.errorReporter).sendError(e);
      return observableThrowError({type: "INVALID", data: e});
    }

    return of(skilltree);
  }

  loadNotifications(data: any) {
    let messages: { rule: LevelRule, content: string }[] = [];
    if (data === Object(data)) {
      Object.keys(data).forEach(key => {
        let rule = this.loadLevelRule(key);
        if (rule) {
          messages.push({rule, content: data[key]});
        }
      });
    }
    return messages;
  }

  loadMobTypes(data: any) {
    let types = [];
    if (Array.isArray(data)) {
      if (data.length == 0) {
        return MobTypes.slice();
      }
      if (data.findIndex(name => name.substr(0, 1) != "-") == -1) {
        types = MobTypes.slice();
      }
      data.forEach(name => {
        if (name == "*") {
          types = MobTypes.slice();
        } else {
          let negative = false;
          if (name.substr(0, 1) == "-") {
            negative = true;
            name = name.substr(1);
          }
          let index = MobTypes.findIndex(type => {
            return type.toLowerCase() == name.toLowerCase();
          });
          if (index >= 0) {
            let typesIndex = types.indexOf(MobTypes[index]);
            if (negative) {
              if (typesIndex >= 0) {
                types.splice(typesIndex, 1);
              }
            } else {
              if (typesIndex == -1) {
                types.push(MobTypes[index]);
              }
            }
          }
        }
      });
    }
    return types;
  }

  loadSkills(data: any): { [name: string]: Upgrade[] } {
    let skills = {};
    Skills.forEach(skillInfo => {
      if (data[skillInfo.id]) {
        skills[skillInfo.id] = [];
        let upgrades = data[skillInfo.id].getProp("Upgrades");
        if (upgrades === Object(upgrades)) {
          Object.keys(upgrades).forEach(key => {
            let rule = this.loadLevelRule(key);
            if (rule) {
              let upgrade = SkillLoader[skillInfo.id](upgrades[key]);
              upgrade.rule = rule;
              skills[skillInfo.id].push(upgrade);
            }
          });
        }
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
          } else if (match.startsWith("<")) {
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
          levelRule.exact.push(level);
        }
      });
      if (levelRule.exact.length == 0) {
        return null;
      }
    }
    return levelRule;
  }
}

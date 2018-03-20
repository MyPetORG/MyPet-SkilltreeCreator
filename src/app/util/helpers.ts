import { LevelRule as LR } from "../models/level-rule";

export class LevelRule {
  static toKey(rule: LR): string {
    if (rule.exact && rule.exact.length > 0) {
      return "LEVEL_RULE_EXACT";
    } else {
      let key = "LEVEL_RULE_EVERY";
      if (rule.every > 1) {
        key += "_X";
      }
      key += "_LEVEL";
      if (rule.minimum) {
        key += "_START";
      }
      if (rule.limit) {
        key += "_END";
      }
      return key
    }
  }

  static toData(rule: LR): any {
    if (rule.exact && rule.exact.length > 0) {
      return {levels: rule.exact.join(', ')}
    } else {
      let data: any = {};
      if (rule.every > 1) {
        data.level = rule.every;
      }
      if (rule.minimum) {
        data.start = rule.minimum;
      }
      if (rule.limit) {
        data.end = rule.limit;
      }
      return data
    }
  }
}


export function setDefault(object: object, field: string, value: any) {
  if (typeof value !== "undefined") {
    object[field] = value;
  }
}

export function matchOrDefault(value: string, patter, def: any) {
  if (value.match(patter)) {
    return value;
  }
  return def;
}

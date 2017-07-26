import { LevelRule as LR } from "../models/LevelRule";

export class LevelRule {
  static toString(rule: LR) {
    if (rule.exact && rule.exact.length > 0) {
      return "Level: " + rule.exact.join(', ')
    } else {
      let ret = "Every ";
      if (rule.every == 1) {
        ret += "level";
      } else {
        ret += rule.every + " levels";
      }
      if (rule.minimum) {
        ret += ", starting at level " + rule.minimum;
      }
      if (rule.limit) {
        ret += ", ending at level " + rule.limit;
      }
      return ret + "."
    }
  }
}


export function setDefault(object: object, field: string, value: any) {
  if (typeof value !== "undefined") {
    object[field] = value;
  }
}

export class LevelRule {
  exact: number[] = [];
  every: number;
  minimum: number;
  limit: number;

  static toString(rule: LevelRule) {
    if (rule.exact.length > 0) {
      return "Level: " + rule.exact.join(', ')
    } else {
      let ret = "Every "
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

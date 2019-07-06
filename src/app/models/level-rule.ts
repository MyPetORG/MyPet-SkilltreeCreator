export interface LevelRule {
  exact?: number[];
  every?: number;
  minimum?: number;
  limit?: number;
}

export function toKey(rule: LevelRule): string {
  if (rule.exact && rule.exact.length > 0) {
    return 'LEVEL_RULE_EXACT';
  } else {
    let key = 'LEVEL_RULE_EVERY';
    if (rule.every > 1) {
      key += '_X';
    }
    key += '_LEVEL';
    if (rule.minimum) {
      key += '_START';
    }
    if (rule.limit) {
      key += '_END';
    }
    return key;
  }
}

export function toData(rule: LevelRule): any {
  if (rule.exact && rule.exact.length > 0) {
    return { levels: rule.exact.join(', ') };
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
    return data;
  }
}

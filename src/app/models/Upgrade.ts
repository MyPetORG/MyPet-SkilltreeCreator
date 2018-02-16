import { LevelRule } from "./LevelRule";

let upgradeID = 0;

export interface Upgrade {
  rule?: LevelRule;
}

export const getNewUpgradeID = function () {
  return upgradeID++;
};

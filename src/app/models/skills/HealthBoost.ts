import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface HealthBoost extends Upgrade {
  health?: string;
}

export class HealthBoostDefault implements HealthBoost {
  id = getNewUpgradeID();
  health = "+0";
}

export function HealthBoostLoader(data: any): HealthBoost {
  let healthBoost: HealthBoost = Object.assign({}, new HealthBoostDefault);
  setDefault(healthBoost, "health", data.getProp("health"));
  return healthBoost;
}

export function HealthBoostSaver(data: HealthBoost) {
  let savedData: any = {};
  if (data.health && /[\\+\-=]?(\d+(?:\.\d+)?)/g.exec(data.health)[1] != "0") {
    savedData.Health = data.health;
  }
  return savedData;
}

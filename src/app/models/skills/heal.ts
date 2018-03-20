import { getNewUpgradeID, Upgrade } from "../upgrade";
import { matchOrDefault, setDefault } from "../../util/helpers";

export interface Heal extends Upgrade {
  timer?: string;
  health?: string;
}

export class HealDefault implements Heal {
  id = getNewUpgradeID();
  timer = "+0";
  health = "+0";
}

export function HealLoader(data: any): Heal {
  let heal: Heal = Object.assign({}, new HealDefault);
  heal.timer = matchOrDefault(data.getPropAs("timer", "string"), /[+-][0-9]+/, "+0");
  heal.health = matchOrDefault(data.getPropAs("health", "string"), /[+-][0-9]+(\.[0-9]+)?/, "+0");
  return heal;
}

export function HealSaver(data: Heal) {
  let savedData: any = {};
  if (data.health && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.health)[1] != "0") {
    savedData.Health = data.health;
  }
  if (data.timer && /[\\+\-]?(\d+)/g.exec(data.timer)[1] != "0") {
    savedData.Timer = data.timer;
  }
  return savedData;
}

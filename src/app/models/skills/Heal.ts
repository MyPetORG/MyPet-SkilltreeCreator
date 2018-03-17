import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

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
  setDefault(heal, "timer", data.getProp("timer"));
  setDefault(heal, "health", data.getProp("health"));
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

import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Life extends Upgrade {
  health?: string;
}

export class LifeDefault implements Life {
  id = getNewUpgradeID();
  health = "+0";
}

export function LifeLoader(data: any): Life {
  let life: Life = Object.assign({}, new LifeDefault);
  setDefault(life, "health", data.getProp("health"));
  return life;
}

export function LifeSaver(data: Life) {
  let savedData: any = {};
  if (data.health && /[\\+\-=]?(\d+(?:\.\d+)?)/g.exec(data.health)[1] != "0") {
    savedData.Health = data.health;
  }
  return savedData;
}

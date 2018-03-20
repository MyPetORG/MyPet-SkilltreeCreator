import { getNewUpgradeID, Upgrade } from "../upgrade";
import { matchOrDefault, setDefault } from "../../util/helpers";

export interface Life extends Upgrade {
  health?: string;
}

export class LifeDefault implements Life {
  id = getNewUpgradeID();
  health = "+0";
}

export function LifeLoader(data: any): Life {
  let life: Life = Object.assign({}, new LifeDefault);
  life.health = matchOrDefault(data.getPropAs("health", "string"), /[+-][0-9]+(\.[0-9]+)?/, "+0");
  return life;
}

export function LifeSaver(data: Life) {
  let savedData: any = {};
  if (data.health && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.health)[1] != "0") {
    savedData.Health = data.health;
  }
  return savedData;
}

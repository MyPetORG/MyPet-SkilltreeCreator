import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Poison extends Upgrade {
  chance?: string;
  duration?: string;
}

export class PoisonDefault implements Poison {
  id = getNewUpgradeID();
  chance = "+0";
  duration = "+0";
}

export function PoisonLoader(data: any): Poison {
  let poison: Poison = Object.assign({}, new PoisonDefault);
  setDefault(poison, "chance", data.getProp("chance"));
  setDefault(poison, "duration", data.getProp("duration"));
  return poison;
}

export function PoisonSaver(data: Poison) {
  let savedData: any = {};
  if (data.duration && /[\\+\-=]?(\d+)/g.exec(data.duration)[1] != "0") {
    savedData.Duration = data.duration;
  }
  if (data.chance && /[\\+\-=]?(\d+(?:\.\d+)?)/g.exec(data.chance)[1] != "0") {
    savedData.Chance = data.chance;
  }
  return savedData;
}

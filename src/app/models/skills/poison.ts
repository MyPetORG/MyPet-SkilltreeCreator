import { getNewUpgradeID, Upgrade } from "../upgrade";
import { matchOrDefault, setDefault } from "../../util/helpers";

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
  poison.chance = matchOrDefault(data.getPropAs("chance", "string"), /[+-](?:[0-9]|[1-9][0-9]|100)/, "+0");
  poison.duration = matchOrDefault(data.getPropAs("duration", "string"), /[+-][0-9]+/, "+0");
  return poison;
}

export function PoisonSaver(data: Poison) {
  let savedData: any = {};
  if (data.duration && /[\\+\-]?(\d+)/g.exec(data.duration)[1] != "0") {
    savedData.Duration = data.duration;
  }
  if (data.chance && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.chance)[1] != "0") {
    savedData.Chance = data.chance;
  }
  return savedData;
}

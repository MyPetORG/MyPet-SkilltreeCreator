import { getNewUpgradeID, Upgrade } from "../upgrade";
import { matchOrDefault, setDefault } from "../../util/helpers";

export interface Slow extends Upgrade {
  chance?: string;
  duration?: string;
}

export class SlowDefault implements Slow {
  id = getNewUpgradeID();
  chance = "+0";
  duration = "+0";
}

export function SlowLoader(data: any): Slow {
  let slow: Slow = Object.assign({}, new SlowDefault);
  slow.chance = matchOrDefault(data.getPropAs("chance", "string"), /[+-](?:[0-9]|[1-9][0-9]|100)/, "+0");
  slow.duration = matchOrDefault(data.getPropAs("duration", "string"), /[+-][0-9]+/, "+0");
  return slow;
}

export function SlowSaver(data: Slow) {
  let savedData: any = {};
  if (data.duration && /[\\+\-]?(\d+)/g.exec(data.duration)[1] != "0") {
    savedData.Duration = data.duration;
  }
  if (data.chance && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.chance)[1] != "0") {
    savedData.Chance = data.chance;
  }
  return savedData;
}

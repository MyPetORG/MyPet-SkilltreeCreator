import { getNewUpgradeID, Upgrade } from "../upgrade";
import { setDefault } from "../../util/helpers";

export interface Wither extends Upgrade {
  chance?: string;
  duration?: string;
}

export class WitherDefault implements Wither {
  id = getNewUpgradeID();
  chance = "+0";
  duration = "+0";
}

export function WitherLoader(data: any): Wither {
  let slow: Wither = Object.assign({}, new WitherDefault);
  setDefault(slow, "chance", data.getProp("chance"));
  setDefault(slow, "duration", data.getProp("duration"));
  return slow;
}

export function WitherSaver(data: Wither) {
  let savedData: any = {};
  if (data.duration && /[\\+\-]?(\d+)/g.exec(data.duration)[1] != "0") {
    savedData.Duration = data.duration;
  }
  if (data.chance && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.chance)[1] != "0") {
    savedData.Chance = data.chance;
  }
  return savedData;
}

import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Fire extends Upgrade {
  chance?: string;
  duration?: string;
}

export class FireDefault implements Fire {
  id = getNewUpgradeID();
  chance = "+0";
  duration = "+0";
}

export function FireLoader(data: any): Fire {
  let fire: Fire = Object.assign({}, new FireDefault);
  setDefault(fire, "chance", data.getProp("chance"));
  setDefault(fire, "duration", data.getProp("duration"));
  return fire;
}

export function FireSaver(data: Fire) {
  let savedData: any = {};
  if (data.duration && /[\\+\-=]?(\d+)/g.exec(data.duration)[1] != "0") {
    savedData.Duration = data.duration;
  }
  if (data.chance && /[\\+\-=]?(\d+(?:\.\d+)?)/g.exec(data.chance)[1] != "0") {
    savedData.Chance = data.chance;
  }
  return savedData;
}

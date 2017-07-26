import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Slow extends Upgrade {
  chance?: string;
  duration?: string;
}

export class SlowDefault implements Slow {
  id = getNewUpgradeID();
  chance: "+0";
  duration: "+0";
}

export function SlowLoader(data: any): Slow {
  let slow: Slow = Object.assign({}, new SlowDefault);
  setDefault(slow, "chance", data.getProp("chance"));
  setDefault(slow, "duration", data.getProp("duration"));
  return slow;
}

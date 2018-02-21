import { getNewUpgradeID, Upgrade } from "../Upgrade";
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

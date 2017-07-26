import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Fire extends Upgrade {
  chance?: string;
  duration?: string;
}

export class FireDefault implements Fire {
  id = getNewUpgradeID();
  chance: "+0";
  duration: "+0";
}

export function FireLoader(data: any): Fire {
  let fire: Fire = Object.assign({}, new FireDefault);
  setDefault(fire, "chance", data.chance || data.Chance);
  setDefault(fire, "duration", data.duration || data.Duration);
  return fire;
}

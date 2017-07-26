import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Poison extends Upgrade {
  chance?: string;
  duration?: string;
}

export class PoisonDefault implements Poison {
  id = getNewUpgradeID();
  chance: "+0";
  duration: "+0";
}

export function PoisonLoader(data: any): Poison {
  let poison: Poison = Object.assign({}, new PoisonDefault);
  setDefault(poison, "chance", data.getProp("chance"));
  setDefault(poison, "duration", data.getProp("duration"));
  return poison;
}

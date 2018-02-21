import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Ranged extends Upgrade {
  damage?: string;
  rate?: string;
  projectile?: string | null;
}

export class RangedDefault implements Ranged {
  id = getNewUpgradeID();
  damage = "+0";
  rate = "+0";
  projectile = null;
}

export function RangedLoader(data: any): Ranged {
  let ranged: Ranged = Object.assign({}, new RangedDefault);
  setDefault(ranged, "damage", data.getProp("damage"));
  setDefault(ranged, "rate", data.getProp("rate"));
  setDefault(ranged, "projectile", data.getProp("projectile"));
  return ranged;
}

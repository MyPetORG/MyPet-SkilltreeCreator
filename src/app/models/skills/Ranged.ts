import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Ranged extends Upgrade {
  damage?: string;
  rate?: string;
  projectile?: string | null;
}

export class RangedDefault implements Ranged {
  id = getNewUpgradeID();
  damage: "+0";
  rate: "+0";
  projectile: null;
}

export function RangedLoader(data: any): Ranged {
  let ranged: Ranged = Object.assign({}, new RangedDefault);
  setDefault(ranged, "damage", data.damage || data.Damage);
  setDefault(ranged, "rate", data.rate || data.Rate);
  setDefault(ranged, "projectile", data.projectile || data.Projectile);
  return ranged;
}

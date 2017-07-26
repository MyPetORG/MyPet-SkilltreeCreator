import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Damage extends Upgrade {
  damage?: string;
}

export class DamageDefault implements Damage {
  id = getNewUpgradeID();
  damage: "+0";
}

export function DamageLoader(data: any): Damage {
  let damage: Damage = Object.assign({}, new DamageDefault);
  setDefault(damage, "damage", data.damage || data.Damage);
  return damage;
}

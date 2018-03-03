import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Damage extends Upgrade {
  damage?: string;
}

export class DamageDefault implements Damage {
  id = getNewUpgradeID();
  damage = "+0";
}

export function DamageLoader(data: any): Damage {
  let damage: Damage = Object.assign({}, new DamageDefault);
  setDefault(damage, "damage", data.getProp("damage"));
  return damage;
}

export function DamageSaver(data: Damage) {
  let savedData: any = {};
  if (data.damage && /[\\+\-=]?(\d+(?:\.\d+)?)/g.exec(data.damage)[1] != "0") {
    savedData.Damage = data.damage;
  }
  return savedData;
}

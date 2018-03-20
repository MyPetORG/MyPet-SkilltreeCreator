import { getNewUpgradeID, Upgrade } from "../upgrade";
import { matchOrDefault, setDefault } from "../../util/helpers";

export interface Damage extends Upgrade {
  damage?: string;
}

export class DamageDefault implements Damage {
  id = getNewUpgradeID();
  damage = "+0";
}

export function DamageLoader(data: any): Damage {
  let damage: Damage = Object.assign({}, new DamageDefault);
  damage.damage = matchOrDefault(data.getPropAs("damage", "string"), /[+-][0-9]+(\.[0-9]+)?/, "+0");
  return damage;
}

export function DamageSaver(data: Damage) {
  let savedData: any = {};
  if (data.damage && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.damage)[1] != "0") {
    savedData.Damage = data.damage;
  }
  return savedData;
}

import { getNewUpgradeID, Upgrade } from "../upgrade";
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

export function RangedSaver(data: Ranged) {
  let savedData: any = {};
  if (data.damage && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.damage)[1] != "0") {
    savedData.Damage = data.damage;
  }
  if (data.rate && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.rate)[1] != "0") {
    savedData.Rate = data.rate;
  }
  if (data.projectile) {
    savedData.Projectile = data.projectile;
  }
  return savedData;
}

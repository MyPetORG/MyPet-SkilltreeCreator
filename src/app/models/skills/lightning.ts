import { getNewUpgradeID, Upgrade } from "../upgrade";
import { setDefault } from "../../util/helpers";

export interface Lightning extends Upgrade {
  chance?: string;
  damage?: string;
}

export class LightningDefault implements Lightning {
  id = getNewUpgradeID();
  chance = "+0";
  damage = "+0";
}

export function LightningLoader(data: any): Lightning {
  let lightning: Lightning = Object.assign({}, new LightningDefault);
  setDefault(lightning, "chance", data.getProp("chance"));
  setDefault(lightning, "damage", data.getProp("damage"));
  return lightning;
}

export function LightningSaver(data: Lightning) {
  let savedData: any = {};
  if (data.damage && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.damage)[1] != "0") {
    savedData.Damage = data.damage;
  }
  if (data.chance && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.chance)[1] != "0") {
    savedData.Chance = data.chance;
  }
  return savedData;
}

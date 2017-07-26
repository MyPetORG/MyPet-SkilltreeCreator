import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Lightning extends Upgrade {
  chance?: string;
  damage?: string;
}

export class LightningDefault implements Lightning {
  id = getNewUpgradeID();
  chance: "+0";
  damage: "+0";
}

export function LightningLoader(data: any): Lightning {
  let lightning: Lightning = Object.assign({}, new LightningDefault);
  setDefault(lightning, "chance", data.chance || data.Chance);
  setDefault(lightning, "damage", data.damage || data.Damage);
  return lightning;
}

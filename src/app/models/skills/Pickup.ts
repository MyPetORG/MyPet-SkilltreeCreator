import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Pickup extends Upgrade {
  range?: string;
  exp?: boolean | null;
}

export class PickupDefault implements Pickup {
  id = getNewUpgradeID();
  range = "+0";
  exp = null;
}

export function PickupLoader(data: any): Pickup {
  let pickup: Pickup = Object.assign({}, new PickupDefault);
  setDefault(pickup, "range", data.getProp("range"));
  setDefault(pickup, "exp", data.getProp("exp"));
  return pickup;
}

export function PickupSaver(data: Pickup) {
  let savedData: any = {};
  if (data.range && /[\\+\-=]?(\d+)/g.exec(data.range)[1] != "0") {
    savedData.Range = data.range;
  }
  if (data.exp != null) {
    savedData.Exp = data.exp;
  }
  return savedData;
}

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

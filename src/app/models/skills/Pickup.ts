import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Pickup extends Upgrade {
  range?: string;
  exp?: boolean | null;
}

export class PickupDefault implements Pickup {
  id = getNewUpgradeID();
  range: "+0";
  exp: null;
}

export function PickupLoader(data: any): Pickup {
  let pickup: Pickup = Object.assign({}, new PickupDefault);
  setDefault(pickup, "range", data.Range);
  setDefault(pickup, "exp", data.exp || data.Exp || data.EXP);
  return pickup;
}

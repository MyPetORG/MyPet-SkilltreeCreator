import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Ride extends Upgrade {
  canFly?: boolean | null;
  speed?: string;
  jumpHeight?: string;
}

export class RideDefault implements Ride {
  id = getNewUpgradeID();
  canFly: null;
  speed: "+0";
  jumpHeight: "+0";
}

export function RideLoader(data: any): Ride {
  let ride: Ride = Object.assign({}, new RideDefault);
  setDefault(ride, "speed", data.getProp("speed"));
  setDefault(ride, "jumpHeight", data.getProp("jumpheight"));
  setDefault(ride, "canFly", data.getProp("canfly"));
  return ride;
}

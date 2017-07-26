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
  setDefault(ride, "speed", data.speed || data.Speed);
  setDefault(ride, "jumpHeight", data.jumpheight || data.Jumpheight || data.jumpHeight || data.JumpHeight);
  setDefault(ride, "canFly", data.canfly || data.Canfly || data.canFly || data.CanFly);
  return ride;
}

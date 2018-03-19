import { getNewUpgradeID, Upgrade } from "../upgrade";
import { setDefault } from "../../util/helpers";

export interface Ride extends Upgrade {
  canFly?: boolean | null;
  speed?: string;
  jumpHeight?: string;
  flyLimit?: string;
  flyRegenRate?: string;
}

export class RideDefault implements Ride {
  id = getNewUpgradeID();
  canFly = null;
  speed = "+0";
  jumpHeight = "+0";
  flyLimit = "+0";
  flyRegenRate = "+0";
}

export function RideLoader(data: any): Ride {
  let ride: Ride = Object.assign({}, new RideDefault);
  setDefault(ride, "speed", data.getProp("speed"));
  setDefault(ride, "jumpHeight", data.getProp("jumpheight"));
  setDefault(ride, "flyLimit", data.getProp("flylimit"));
  setDefault(ride, "flyRegenRate", data.getProp("flyregenrate"));
  setDefault(ride, "canFly", data.getProp("canfly"));
  return ride;
}

export function RideSaver(data: Ride) {
  let savedData: any = {};
  if (data.speed && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.speed)[1] != "0") {
    savedData.Speed = data.speed;
  }
  if (data.jumpHeight && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.jumpHeight)[1] != "0") {
    savedData.JumpHeight = data.jumpHeight;
  }
  if (data.flyLimit && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.flyLimit)[1] != "0") {
    savedData.FlyLimit = data.flyLimit;
  }
  if (data.flyRegenRate && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.flyRegenRate)[1] != "0") {
    savedData.FlyRegenRate = data.flyRegenRate;
  }
  if (data.canFly != null) {
    savedData.CanFly = data.canFly;
  }
  return savedData;
}

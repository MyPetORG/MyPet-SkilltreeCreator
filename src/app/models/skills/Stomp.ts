import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Stomp extends Upgrade {
  chance?: string;
  damage?: string;
}

export class StompDefault implements Stomp {
  id = getNewUpgradeID();
  chance = "+0";
  damage = "+0";
}

export function StompLoader(data: any): Stomp {
  let slow: Stomp = Object.assign({}, new StompDefault);
  setDefault(slow, "chance", data.getProp("chance"));
  setDefault(slow, "damage", data.getProp("damage"));
  return slow;
}

export function StompSaver(data: Stomp) {
  let savedData: any = {};
  if (data.damage && /[\\+\-=]?(\d+(?:\.\d+)?)/g.exec(data.damage)[1] != "0") {
    savedData.Damage = data.damage;
  }
  if (data.chance && /[\\+\-=]?(\d+(?:\.\d+)?)/g.exec(data.chance)[1] != "0") {
    savedData.Chance = data.chance;
  }
  return savedData;
}

import { getNewUpgradeID, Upgrade } from "../upgrade";
import { matchOrDefault, setDefault } from "../../util/helpers";

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
  let stomp: Stomp = Object.assign({}, new StompDefault);
  stomp.chance = matchOrDefault(data.getPropAs("chance", "string"), /[+-](?:[0-9]|[1-9][0-9]|100)/, "+0");
  stomp.damage = matchOrDefault(data.getPropAs("damage", "string"), /[+-][0-9]+(\.[0-9]+)?/, "+0");
  return stomp;
}

export function StompSaver(data: Stomp) {
  let savedData: any = {};
  if (data.damage && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.damage)[1] != "0") {
    savedData.Damage = data.damage;
  }
  if (data.chance && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.chance)[1] != "0") {
    savedData.Chance = data.chance;
  }
  return savedData;
}

import { getNewUpgradeID, Upgrade } from "../upgrade";
import { matchOrDefault } from "../../util/helpers";

export interface Knockback extends Upgrade {
  chance?: string;
}

export class KnockbackDefault implements Knockback {
  id = getNewUpgradeID();
  chance = "+0";
}

export function KnockbackLoader(data: any): Knockback {
  let knockback: Knockback = Object.assign({}, new KnockbackDefault);
  knockback.chance = matchOrDefault(data.getPropAs("chance", "string"), /[+-](?:[0-9]|[1-9][0-9]|100)/, "+0");
  return knockback;
}

export function KnockbackSaver(data: Knockback) {
  let savedData: any = {};
  if (data.chance && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.chance)[1] != "0") {
    savedData.Chance = data.chance;
  }
  return savedData;
}

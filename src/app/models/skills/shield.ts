import { getNewUpgradeID, Upgrade } from "../upgrade";
import { matchOrDefault } from "../../util/helpers";

export interface Shield extends Upgrade {
  chance?: string;
  redirect?: string;
}

export class ShieldDefault implements Shield {
  id = getNewUpgradeID();
  chance = "+0";
  redirect = "+0";
}

export function ShieldLoader(data: any): Shield {
  let shield: Shield = Object.assign({}, new ShieldDefault);
  shield.chance = matchOrDefault(data.getPropAs("chance", "string"), /[+-](?:[0-9]|[1-9][0-9]|100)/, "+0");
  shield.redirect = matchOrDefault(data.getPropAs("redirect", "string"), /[+-](?:[0-9]|[1-9][0-9]|100)/, "+0");
  return shield;
}

export function ShieldSaver(data: Shield) {
  let savedData: any = {};
  if (data.redirect && /[\\+\-]?(\d+)/g.exec(data.redirect)[1] != "0") {
    savedData.Redirect = data.redirect;
  }
  if (data.chance && /[\\+\-]?(\d+)/g.exec(data.chance)[1] != "0") {
    savedData.Chance = data.chance;
  }
  return savedData;
}

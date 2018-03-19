import { getNewUpgradeID, Upgrade } from "../upgrade";
import { setDefault } from "../../util/helpers";

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
  setDefault(shield, "chance", data.getProp("chance"));
  setDefault(shield, "redirect", data.getProp("redirect"));
  return shield;
}

export function ShieldSaver(data: Shield) {
  let savedData: any = {};
  if (data.redirect && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.redirect)[1] != "0") {
    savedData.Redirect = data.redirect;
  }
  if (data.chance && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.chance)[1] != "0") {
    savedData.Chance = data.chance;
  }
  return savedData;
}

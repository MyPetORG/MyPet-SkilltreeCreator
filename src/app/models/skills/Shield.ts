import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Shield extends Upgrade {
  chance?: string;
  redirect?: string;
}

export class ShieldDefault implements Shield {
  id = getNewUpgradeID();
  chance: "+0";
  redirect: "+0";
}

export function ShieldLoader(data: any): Shield {
  let shield: Shield = Object.assign({}, new ShieldDefault);
  setDefault(shield, "chance", data.getProp("chance"));
  setDefault(shield, "redirect", data.getProp("redirect"));
  return shield;
}

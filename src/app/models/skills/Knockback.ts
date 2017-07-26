import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Knockback extends Upgrade {
  chance?: string;
}

export class KnockbackDefault implements Knockback {
  id = getNewUpgradeID();
  chance: "+0";
}

export function KnockbackLoader(data: any): Knockback {
  let knockback: Knockback = Object.assign({}, new KnockbackDefault);
  setDefault(knockback, "chance", data.getProp("chance"));
  return knockback;
}

import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Thorns extends Upgrade {
  chance?: string;
  reflection?: string;
}

export class ThornsDefault implements Thorns {
  id = getNewUpgradeID();
  chance: "+0";
  reflection: "+0";
}

export function ThornsLoader(data: any): Thorns {
  let slow: Thorns = Object.assign({}, new ThornsDefault);
  setDefault(slow, "chance", data.getProp("chance"));
  setDefault(slow, "reflection", data.getProp("reflection"));
  return slow;
}

import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Thorns extends Upgrade {
  chance?: string;
  reflection?: string;
}

export class ThornsDefault implements Thorns {
  id = getNewUpgradeID();
  chance = "+0";
  reflection = "+0";
}

export function ThornsLoader(data: any): Thorns {
  let thorns: Thorns = Object.assign({}, new ThornsDefault);
  setDefault(thorns, "chance", data.getProp("chance"));
  setDefault(thorns, "reflection", data.getProp("reflection"));
  return thorns;
}

export function ThornsSaver(data: Thorns) {
  let savedData: any = {};
  if (data.reflection && /[\\+\-=]?(\d+(?:\.\d+)?)/g.exec(data.reflection)[1] != "0") {
    savedData.Reflection = data.reflection;
  }
  if (data.chance && /[\\+\-=]?(\d+(?:\.\d+)?)/g.exec(data.chance)[1] != "0") {
    savedData.Chance = data.chance;
  }
  return savedData;
}

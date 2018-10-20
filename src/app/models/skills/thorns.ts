import { getNewUpgradeID, Upgrade } from "../upgrade";
import { matchOrDefault } from "../../util/helpers";

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
  thorns.chance = matchOrDefault(data.getPropAs("chance", "string"), /[+-](?:[0-9]|[1-9][0-9]|100)/, "+0");
  thorns.reflection = matchOrDefault(data.getPropAs("reflection", "string"), /[+-](?:[0-9]|[1-9][0-9]|100)/, "+0");
  return thorns;
}

export function ThornsSaver(data: Thorns) {
  let savedData: any = {};
  if (data.reflection && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.reflection)[1] != "0") {
    savedData.Reflection = data.reflection;
  }
  if (data.chance && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.chance)[1] != "0") {
    savedData.Chance = data.chance;
  }
  return savedData;
}

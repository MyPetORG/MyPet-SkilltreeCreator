import { getNewUpgradeID, Upgrade } from "../upgrade";
import { matchOrDefault } from "../../util/helpers";

export interface Backpack extends Upgrade {
  rows?: string;
  drop?: boolean | null;
}

export class BackpackDefault implements Backpack {
  id = getNewUpgradeID();
  rows = "+0";
  drop = null;
}

export function BackpackLoader(data: any): Backpack {
  let backpack: Backpack = Object.assign({}, new BackpackDefault);
  backpack.rows = matchOrDefault(data.getPropAs("rows", "string"), /[+\\-][0-9]/, "+0");
  backpack.drop = data.getPropAs("drop", "bool|null");

  return backpack;
}

export function BackpackSaver(data: Backpack) {
  let savedData: any = {};
  if (data.rows && /[\\+\-]?(\d+)/g.exec(data.rows)[1] != "0") {
    savedData.rows = data.rows;
  }
  if (data.drop != null) {
    savedData.drop = data.drop;
  }
  return savedData;
}

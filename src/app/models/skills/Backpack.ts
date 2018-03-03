import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

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
  setDefault(backpack, "rows", data.getProp("rows"));
  setDefault(backpack, "drop", data.getProp("drop"));

  return backpack;
}

export function BackpackSaver(data: Backpack) {
  let savedData: any = {};
  if (data.rows && /[\\+\-=]?(\d+)/g.exec(data.rows)[1] != "0") {
    savedData.rows = data.rows;
  }
  if (data.drop != null) {
    savedData.drop = data.drop;
  }
  return savedData;
}

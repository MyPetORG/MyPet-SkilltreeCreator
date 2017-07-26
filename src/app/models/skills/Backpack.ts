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
  setDefault(backpack, "rows", data.rows || data.Rows);
  setDefault(backpack, "drop", data.drop || data.Drop);

  return backpack;
}

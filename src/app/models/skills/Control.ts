import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Control extends Upgrade {
  active?: boolean | null;
}

export class ControlDefault implements Control {
  id = getNewUpgradeID();
  active: null;
}

export function ControlLoader(data: any): Control {
  let control: Control = Object.assign({}, new ControlDefault);
  setDefault(control, "active", data.getProp("active"));
  return control;
}

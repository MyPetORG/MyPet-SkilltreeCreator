import { getNewUpgradeID, Upgrade } from "../upgrade";

export interface Control extends Upgrade {
  active?: boolean | null;
}

export class ControlDefault implements Control {
  id = getNewUpgradeID();
  active = null;
}

export function ControlLoader(data: any): Control {
  let control: Control = Object.assign({}, new ControlDefault);
  control.active = data.getPropAs("active", "bool|null");
  return control;
}

export function ControlSaver(data: Control): any {
  let savedData: any = {};
  if (data.active != null) {
    savedData.Active = data.active;
  }
  return savedData;
}

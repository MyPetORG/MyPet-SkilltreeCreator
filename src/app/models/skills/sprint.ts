import { getNewUpgradeID, Upgrade } from "../upgrade";
import { matchOrDefault, setDefault } from "../../util/helpers";

export interface Sprint extends Upgrade {
  active?: boolean | null;
}

export class SprintDefault implements Sprint {
  id = getNewUpgradeID();
  active = null;
}

export function SprintLoader(data: any): Sprint {
  let sprint: Sprint = Object.assign({}, new SprintDefault);
  sprint.active = data.getPropAs("active", "bool|null");
  return sprint;
}

export function SprintSaver(data: Sprint): any {
  let savedData: any = {};
  if (data.active != null) {
    savedData.Active = data.active;
  }
  return savedData;
}

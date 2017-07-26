import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Behavior extends Upgrade {
  friend?: boolean | null;
  aggro?: boolean | null;
  farm?: boolean | null;
  raid?: boolean | null;
  duel?: boolean | null;
}

export class BehaviorDefault implements Behavior {
  id = getNewUpgradeID();
  friend: null;
  aggro: null;
  farm: null;
  raid: null;
  duel: null;
}


export function BehaviorLoader(data: any): Behavior {
  let behavior: Behavior = Object.assign({}, new BehaviorDefault);
  setDefault(behavior, "aggro", data.aggro || data.Aggro);
  setDefault(behavior, "duel", data.duel || data.Duel);
  setDefault(behavior, "farm", data.farm || data.Farm);
  setDefault(behavior, "friend", data.friend || data.Friend);
  setDefault(behavior, "raid", data.raid || data.Raid);
  return behavior;
}

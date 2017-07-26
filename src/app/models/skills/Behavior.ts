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
  setDefault(behavior, "aggro", data.getProp("aggro"));
  setDefault(behavior, "duel", data.getProp("duel"));
  setDefault(behavior, "farm", data.getProp("farm"));
  setDefault(behavior, "friend", data.getProp("friend"));
  setDefault(behavior, "raid", data.getProp("raid"));
  return behavior;
}

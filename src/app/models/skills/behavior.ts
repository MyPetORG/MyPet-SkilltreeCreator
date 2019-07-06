import { getNewUpgradeID, Upgrade } from '../upgrade';

export interface Behavior extends Upgrade {
  friend?: boolean | null;
  aggro?: boolean | null;
  farm?: boolean | null;
  raid?: boolean | null;
  duel?: boolean | null;
}

export class BehaviorDefault implements Behavior {
  id = getNewUpgradeID();
  friend = null;
  aggro = null;
  farm = null;
  raid = null;
  duel = null;
}


export function BehaviorLoader(data: any): Behavior {
  let behavior: Behavior = Object.assign({}, new BehaviorDefault);
  behavior.aggro = data.getPropAs('aggro', 'bool|null');
  behavior.duel = data.getPropAs('duel', 'bool|null');
  behavior.farm = data.getPropAs('farm', 'bool|null');
  behavior.friend = data.getPropAs('friend', 'bool|null');
  behavior.raid = data.getPropAs('raid', 'bool|null');
  return behavior;
}

export function BehaviorSaver(data: Behavior): any {
  let savedData: any = {};
  if (data.aggro != null) {
    savedData.Aggro = data.aggro;
  }
  if (data.duel != null) {
    savedData.Duel = data.duel;
  }
  if (data.farm != null) {
    savedData.Farm = data.farm;
  }
  if (data.friend != null) {
    savedData.Friend = data.friend;
  }
  if (data.raid != null) {
    savedData.Raid = data.raid;
  }
  return savedData;
}

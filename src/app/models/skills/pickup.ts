import { matchOrDefault } from '../../util/helpers';
import { getNewUpgradeID, Upgrade } from '../upgrade';

export interface Pickup extends Upgrade {
  range?: string;
  exp?: boolean | null;
}

export class PickupDefault implements Pickup {
  id = getNewUpgradeID();
  range = '+0';
  exp = null;
}

export function PickupLoader(data: any): Pickup {
  let pickup: Pickup = Object.assign({}, new PickupDefault);
  pickup.range = matchOrDefault(data.getPropAs('range', 'string'), /[+-][0-9]+(\.[0-9]+)?/, '+0');
  pickup.exp = data.getPropAs('exp', 'bool|null');
  return pickup;
}

export function PickupSaver(data: Pickup) {
  let savedData: any = {};
  if (data.range && /[\\+\-]?(\d+)/g.exec(data.range)[1] != '0') {
    savedData.Range = data.range;
  }
  if (data.exp != null) {
    savedData.Exp = data.exp;
  }
  return savedData;
}

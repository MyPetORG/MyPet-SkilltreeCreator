import { matchOrDefault } from '../../util/helpers';
import { getNewUpgradeID, Upgrade } from '../upgrade';

export interface Wither extends Upgrade {
  chance?: string;
  duration?: string;
}

export class WitherDefault implements Wither {
  id = getNewUpgradeID();
  chance = '+0';
  duration = '+0';
}

export function WitherLoader(data: any): Wither {
  let wither: Wither = Object.assign({}, new WitherDefault);
  wither.chance = matchOrDefault(data.getPropAs('chance', 'string'), /[+-](?:[0-9]|[1-9][0-9]|100)/, '+0');
  wither.duration = matchOrDefault(data.getPropAs('duration', 'string'), /[+-][0-9]+/, '+0');
  return wither;
}

export function WitherSaver(data: Wither) {
  let savedData: any = {};
  if (data.duration && /[\\+\-]?(\d+)/g.exec(data.duration)[1] != '0') {
    savedData.Duration = data.duration;
  }
  if (data.chance && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.chance)[1] != '0') {
    savedData.Chance = data.chance;
  }
  return savedData;
}

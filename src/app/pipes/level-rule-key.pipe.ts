import { Pipe, PipeTransform } from '@angular/core';
import { LevelRule, toKey } from '../models/level-rule';

@Pipe({
  name: 'levelRuleKey',
})
export class LevelRuleKeyPipe implements PipeTransform {

  transform(value: LevelRule, args?: any): string {
    return toKey(value);
  }
}

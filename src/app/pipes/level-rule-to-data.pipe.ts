import { Pipe, PipeTransform } from '@angular/core';
import { LevelRule, toData } from '../models/level-rule';

@Pipe({
  name: 'levelRuleToData',
})
export class LevelRuleToDataPipe implements PipeTransform {

  transform(value: LevelRule, args?: any): string {
    return toData(value);
  }
}

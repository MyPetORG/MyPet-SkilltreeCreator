import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { SkillInfo, Skills } from '../../data/skills';
import { Tab } from '../../enums/tab.enum';

export interface LayoutState {
  showSidenav: boolean;
  tab: Tab;
  skill: SkillInfo;
  language: string;

  loaded: boolean;
}

export function createInitialState(): LayoutState {
  return {
    showSidenav: false,
    tab: Tab.SkillEditor,
    skill: Skills[0],
    language: 'en',

    loaded: true,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'Layout' })
export class LayoutStore extends Store<LayoutState> {

  constructor() {
    super(createInitialState());
  }
}


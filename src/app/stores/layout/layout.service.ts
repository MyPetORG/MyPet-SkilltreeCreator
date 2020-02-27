import { Injectable } from '@angular/core';
import { SkillInfo } from '../../data/skills';
import { Tab } from '../../enums/tab.enum';
import { LayoutStore } from './layout.store';

@Injectable({ providedIn: 'root' })
export class LayoutService {

  constructor(
    private layoutStore: LayoutStore,
  ) {
  }

  setSidenavOpen(open: boolean) {
    this.layoutStore.update({
      showSidenav: open,
    });
  }

  switchTab(tab: Tab) {
    this.layoutStore.update({
      tab,
    });
  }

  changeLanguage(language: string) {
    this.layoutStore.update({
      language,
    });
  }

  selectSkill(skill: SkillInfo) {
    this.layoutStore.update({
      skill,
    });
  }
}

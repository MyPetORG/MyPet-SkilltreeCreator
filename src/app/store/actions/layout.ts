import { createAction, props } from '@ngrx/store';
import { SkillInfo } from '../../data/skills';

export const OPEN_SIDENAV = 'OPEN_SIDENAV';
export const CLOSE_SIDENAV = 'CLOSE_SIDENAV';
export const SWITCH_TAB = 'SWITCH_TAB';
export const SELECT_SKILL = 'SELECT_SKILL';
export const SELECT_SKILLTREE = 'SELECT_SKILLTREE';
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const APP_LOADED = 'APP_LOADED';
export const CLOSE_APP = 'CLOSE_APP';


export const openSidenav = createAction(OPEN_SIDENAV);

export const closeSidenav = createAction(CLOSE_SIDENAV);

export const switchTab = createAction(
  SWITCH_TAB,
  props<{ tab: number }>()
);

export const closeApp = createAction(CLOSE_APP);

export const selectSkill = createAction(
  SELECT_SKILL,
  props<{ skill: SkillInfo | null }>()
);

export const selectSkilltree = createAction(
  SELECT_SKILLTREE,
  props<{ skilltree: string | null }>()
);

export const changeLanguage = createAction(
  CHANGE_LANGUAGE,
  props<{ language: string }>()
);

export const appLoaded = createAction(APP_LOADED);

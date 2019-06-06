import { createReducer, on } from '@ngrx/store';
import { SkillInfo, Skills } from '../../data/skills';
import * as LayoutActions from '../actions/layout';


export interface State {
  loaded: boolean;
  showSidenav: boolean;
  tab: number;
  skill: SkillInfo;
  selectedSkilltreeId: string
  language: string
}

const initialState: State = {
  loaded: false,
  showSidenav: false,
  tab: 0,
  skill: Skills[0],
  selectedSkilltreeId: null,
  language: '',
};

export const reducer = createReducer(
  initialState,

  on(LayoutActions.closeSidenav, state => ({ ...state, showSidenav: false })),
  on(LayoutActions.openSidenav, state => ({ ...state, showSidenav: true })),
  on(LayoutActions.switchTab, (state, { tab }) => ({ ...state, tab })),
  on(LayoutActions.selectSkill, (state, { skill }) => ({ ...state, skill })),
  on(LayoutActions.selectSkilltree, (state, { skilltree }) => ({ ...state, selectedSkilltreeId: skilltree })),
  on(LayoutActions.changeLanguage, (state, { language }) => ({ ...state, language })),
  on(LayoutActions.appLoaded, (state) => ({ ...state, loaded: true })),
);

export const getShowSidenav = (state: State) => state.showSidenav;
export const getTab = (state: State) => state.tab;
export const getSelectedSkill = (state: State) => state.skill;
export const getSelectedSkilltreeId = (state: State) => state.selectedSkilltreeId;
export const getLanguage = (state: State) => state.language;
export const isLoaded = (state: State) => state.loaded;

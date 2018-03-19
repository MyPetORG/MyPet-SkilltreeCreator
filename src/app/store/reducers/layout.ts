import * as layout from "../actions/layout";
import { SkillInfo, Skills } from "../../data/skills";


export interface State {
  showSidenav: boolean;
  tab: number;
  premium: boolean;
  skill: SkillInfo;
  selectedSkilltreeId: string
  language: string
}

const initialState: State = {
  showSidenav: false,
  tab: 0,
  premium: true,
  skill: Skills[0],
  selectedSkilltreeId: null,
  language: "",
};

export function reducer(state = initialState, action: layout.Actions): State {
  switch (action.type) {
    case layout.CLOSE_SIDENAV:
      return Object.assign({}, state, {
        showSidenav: false
      });

    case layout.OPEN_SIDENAV:
      return Object.assign({}, state, {
        showSidenav: true
      });

    case layout.SWITCH_TAB:
      return Object.assign({}, state, {
        tab: action.payload
      });

    case layout.TOGGLE_PREMIUM:
      return Object.assign({}, state, {
        premium: !state.premium
      });

    case layout.SELECT_SKILL:
      return Object.assign({}, state, {
        skill: action.payload
      });

    case layout.SELECT_SKILLTREE: {
      return Object.assign({}, state, {
        selectedSkilltreeId: action.payload
      });
    }

    case layout.CHANGE_LANGUAGE: {
      return Object.assign({}, state, {
        language: action.payload
      });
    }

    default:
      return state;
  }
}

export const getShowSidenav = (state: State) => state.showSidenav;
export const getTab = (state: State) => state.tab;
export const getPremium = (state: State) => state.premium;
export const getSelectedSkill = (state: State) => state.skill;
export const getSelectedSkilltreeId = (state: State) => state.selectedSkilltreeId;
export const getLanguage = (state: State) => state.language;

import * as layout from "../actions/layout";
import { SkillInfo, Skills } from "../data/Skills";


export interface State {
  showSidenav: boolean;
  tab: number;
  skill: SkillInfo;
}

const initialState: State = {
  showSidenav: false,
  tab: 0,
  skill: Skills[0]
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

    case layout.SELECT_SKILL:
      return Object.assign({}, state, {
        skill: action.payload
      });

    default:
      return state;
  }
}

export const getShowSidenav = (state: State) => state.showSidenav;
export const getTab = (state: State) => state.tab;
export const getSelectedSkill = (state: State) => state.skill;

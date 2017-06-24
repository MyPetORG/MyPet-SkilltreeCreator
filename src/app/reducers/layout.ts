import * as layout from "../actions/layout";


export interface State {
  showSidenav: boolean;
  tab: number;
}

const initialState: State = {
  showSidenav: false,
  tab: 0,
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
        tab: action.tab
      });

    default:
      return state;
  }
}

export const getShowSidenav = (state: State) => state.showSidenav;
export const getTab = (state: State) => state.tab;

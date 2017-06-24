import { Action } from "@ngrx/store";

export const OPEN_SIDENAV = '[Layout] Open Sidenav';
export const CLOSE_SIDENAV = '[Layout] Close Sidenav';
export const SWITCH_TAB = '[Layout] Change Tab';


export class OpenSidenavAction implements Action {
  readonly type = OPEN_SIDENAV;
}

export class CloseSidenavAction implements Action {
  readonly type = CLOSE_SIDENAV;
}

export class SwitchTabAction implements Action {
  readonly type = SWITCH_TAB;

  constructor(public tab: number) {
  }
}


export type Actions
  = OpenSidenavAction
  | SwitchTabAction
  | CloseSidenavAction;

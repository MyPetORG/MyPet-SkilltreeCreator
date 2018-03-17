import { Action } from "@ngrx/store";
import { SkillInfo } from "../../data/Skills";

export const OPEN_SIDENAV = 'OPEN_SIDENAV';
export const CLOSE_SIDENAV = 'CLOSE_SIDENAV';
export const SWITCH_TAB = 'SWITCH_TAB';
export const TOGGLE_PREMIUM = 'TOGGLE_PREMIUM';
export const SELECT_SKILL = 'SELECT_SKILL';
export const SELECT_SKILLTREE = 'SELECT_SKILLTREE';


export class OpenSidenavAction implements Action {
  readonly type = OPEN_SIDENAV;
}

export class CloseSidenavAction implements Action {
  readonly type = CLOSE_SIDENAV;
}

export class SwitchTabAction implements Action {
  readonly type = SWITCH_TAB;

  constructor(public payload: number) {
  }
}

export class TogglePremiumAction implements Action {
  readonly type = TOGGLE_PREMIUM;

  constructor() {
  }
}

export class SelectSkillAction implements Action {
  readonly type = SELECT_SKILL;

  constructor(public payload: SkillInfo) {
  }
}

export class SelectSkilltreeAction implements Action {
  readonly type = SELECT_SKILLTREE;

  constructor(public payload: string | null) {
  }
}

export type Actions
  = OpenSidenavAction
  | CloseSidenavAction
  | SwitchTabAction
  | TogglePremiumAction
  | SelectSkillAction
  | SelectSkilltreeAction;

import { Action } from "@ngrx/store";
import { SkillInfo } from "../data/Skills";

export const OPEN_SIDENAV = '[Layout] Open Sidenav';
export const CLOSE_SIDENAV = '[Layout] Close Sidenav';
export const SWITCH_TAB = '[Layout] Change Tab';
export const SELECT_SKILL = '[Layout] Select Skill';


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

export class SelectSkillAction implements Action {
  readonly type = SELECT_SKILL;

  constructor(public payload: SkillInfo) {
  }
}

export type Actions
  = OpenSidenavAction
  | CloseSidenavAction
  | SwitchTabAction
  | SelectSkillAction;

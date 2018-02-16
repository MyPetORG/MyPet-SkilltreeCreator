import { Action } from "@ngrx/store";
import { Skilltree } from "../../models/Skilltree";
import { Upgrade } from "../../models/Upgrade";

export const ADD_SKILLTREE = 'ADD_SKILLTREE';
export const LOAD_SKILLTREE = 'LOAD_SKILLTREE';
export const LOAD_SKILLTREE_SUCCESS = 'LOAD_SKILLTREE_SUCCESS';
export const COPY_SKILLTREE = 'COPY_SKILLTREE';
export const REMOVE_SKILLTREE = 'REMOVE_SKILLTREE';
export const RENAME_SKILLTREE = 'RENAME_SKILLTREE';

export const SELECT_SKILLTREE = 'SELECT_SKILLTREE';
export const UPDATE_SKILLTREE_INFO = 'UPDATE_SKILLTREE_INFO';

export const ADD_UPGRADE = 'ADD_UPGRADE';
export const UPDATE_UPGRADE = 'UPDATE_UPGRADE';

/**
 * Add Skilltree Actions
 */
export class AddSkilltreeAction implements Action {
  readonly type = ADD_SKILLTREE;

  constructor(public payload: Skilltree) {
  }
}

export class LoadSkilltreeAction implements Action {
  readonly type = LOAD_SKILLTREE;

  constructor(public payload: any) {
  }
}

export class LoadSkilltreeSuccessAction implements Action {
  readonly type = LOAD_SKILLTREE_SUCCESS;

  constructor(public payload: Skilltree) {
  }
}

export class CopySkilltreeAction implements Action {
  readonly type = COPY_SKILLTREE;

  constructor(public payload: Skilltree) {
  }
}

/**
 * Remove Skilltree Actions
 */
export class RemoveSkilltreeAction implements Action {
  readonly type = REMOVE_SKILLTREE;

  constructor(public payload: Skilltree) {
  }
}

/**
 * Remove Skilltree Actions
 */
export class RenameSkilltreeAction implements Action {
  readonly type = RENAME_SKILLTREE;

  constructor(public newId: string, public oldId: string) {
  }
}

/**
 * Select Skilltree Actions
 */
export class SelectSkilltreeAction implements Action {
  readonly type = SELECT_SKILLTREE;

  constructor(public payload: string | null) {
  }
}

/**
 * Update Skilltree Actions
 */
export class UpdateSkilltreeInfoAction implements Action {
  readonly type = UPDATE_SKILLTREE_INFO;

  constructor(public payload: { changes: any, id: string }) {
  }
}

/**
 * Upgrade Actions
 */

export class AddSkillUpgrade implements Action {
  readonly type = ADD_UPGRADE;

  constructor(public payload: Upgrade) {
  }
}

export class UpdateSkillUpgrade implements Action {
  readonly type = UPDATE_UPGRADE;

  constructor(public upgrade: Upgrade, public update) {
  }
}

export type Actions
  = AddSkilltreeAction
  | LoadSkilltreeAction
  | LoadSkilltreeSuccessAction
  | CopySkilltreeAction
  | RemoveSkilltreeAction
  | RenameSkilltreeAction
  | SelectSkilltreeAction
  | UpdateSkilltreeInfoAction
  | UpdateSkillUpgrade
  | AddSkillUpgrade
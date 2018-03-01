import { Action } from "@ngrx/store";
import { Skilltree } from "../../models/Skilltree";

export const ADD_SKILLTREE = 'ADD_SKILLTREE';
export const LOAD_SKILLTREE = 'LOAD_SKILLTREE';
export const LOAD_SKILLTREES = 'LOAD_SKILLTREES';
export const LOAD_SKILLTREES_SUCCESS = 'LOAD_SKILLTREES_SUCCESS';
export const LOAD_SKILLTREES_FAILED = 'LOAD_SKILLTREES_FAILED';
export const LOAD_SKILLTREE_SUCCESS = 'LOAD_SKILLTREE_SUCCESS';
export const SAVE_SKILLTREES = 'SAVE_SKILLTREES';
export const SAVE_SKILLTREES_SUCCESS = 'SAVE_SKILLTREES_SUCCESS';
export const SAVE_SKILLTREES_FAILED = 'SAVE_SKILLTREES_FAILED';
export const COPY_SKILLTREE = 'COPY_SKILLTREE';
export const UPDATE_SKILLTREE_ORDER = 'UPDATE_SKILLTREE_ORDER';
export const REMOVE_SKILLTREE = 'REMOVE_SKILLTREE';
export const RENAME_SKILLTREE = 'RENAME_SKILLTREE';

export const UPDATE_SKILLTREE_INFO = 'UPDATE_SKILLTREE_INFO';
export const UPDATE_SKILLTREE_UPGRADE = 'UPDATE_SKILLTREE_UPGRADE';

/**
 * Add Skilltree Actions
 */
export class AddSkilltreeAction implements Action {
  readonly type = ADD_SKILLTREE;

  constructor(public payload: Skilltree) {
  }
}

export class LoadSkilltreesAction implements Action {
  readonly type = LOAD_SKILLTREES;
  readonly ignoredByUndo = true;

  constructor() {
  }
}

export class LoadSkilltreesFailedAction implements Action {
  readonly type = LOAD_SKILLTREES_FAILED;
  readonly ignoredByUndo = true;

  constructor(public error: any) {
  }
}

export class LoadSkilltreesSuccessAction implements Action {
  readonly type = LOAD_SKILLTREES_SUCCESS;
  readonly ignoredByUndo = true;

  constructor() {
  }
}

export class LoadSkilltreeAction implements Action {
  readonly type = LOAD_SKILLTREE;
  readonly ignoredByUndo = true;

  constructor(public payload: any) {
  }
}

export class LoadSkilltreeSuccessAction implements Action {
  readonly type = LOAD_SKILLTREE_SUCCESS;
  readonly ignoredByUndo = true;

  constructor(public payload: Skilltree) {
  }
}

export class SaveSkilltreesAction implements Action {
  readonly type = SAVE_SKILLTREES;
  readonly ignoredByUndo = true;

  constructor() {
  }
}

export class SaveSkilltreesSuccessAction implements Action {
  readonly type = SAVE_SKILLTREES_SUCCESS;
  readonly ignoredByUndo = true;

  constructor(public result: any) {
  }
}

export class SaveSkilltreesFailedAction implements Action {
  readonly type = SAVE_SKILLTREES_FAILED;
  readonly ignoredByUndo = true;

  constructor(public error: any) {
  }
}

export class CopySkilltreeAction implements Action {
  readonly type = COPY_SKILLTREE;

  constructor(public payload: Skilltree) {
  }
}

export class UpdateSkilltreeOrderAction implements Action {
  readonly type = UPDATE_SKILLTREE_ORDER;

  constructor(public payload: { id: string, changes: { order: number } }[], public ignoredByUndo = true) {
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
 * Update Skilltree Actions
 */
export class UpdateSkilltreeInfoAction implements Action {
  readonly type = UPDATE_SKILLTREE_INFO;

  constructor(public payload: { changes: any, id: string }) {
  }
}

export class UpdateSkilltreeUpgradeAction implements Action {
  readonly type = UPDATE_SKILLTREE_UPGRADE;

  constructor(public payload: { changes: any, id: string }) {
  }
}

export type Actions
  = AddSkilltreeAction
  | LoadSkilltreeAction
  | LoadSkilltreeSuccessAction
  | LoadSkilltreesAction
  | LoadSkilltreesFailedAction
  | SaveSkilltreesAction
  | SaveSkilltreesSuccessAction
  | SaveSkilltreesFailedAction
  | CopySkilltreeAction
  | UpdateSkilltreeOrderAction
  | RemoveSkilltreeAction
  | RenameSkilltreeAction
  | UpdateSkilltreeInfoAction
  | UpdateSkilltreeUpgradeAction

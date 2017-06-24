import { Action } from "@ngrx/store";
import { Skilltree } from "../models/Skilltree";

export const ADD_SKILLTREE = '[Skilltree] Add';
export const LOAD_SKILLTREE = '[Skilltree] Load';
export const COPY_SKILLTREE = '[Skilltree] Copy';
export const REMOVE_SKILLTREE = '[Skilltree] Remove';

export const SELECT_SKILLTREE = '[Skilltree] Select';
export const UPDATE_SKILLTREE_INFO = '[Skilltree] Update Info';

/**
 * Add Skilltree Actions
 */
export class AddSkilltreeAction implements Action {
  readonly type = ADD_SKILLTREE;

  constructor(public payload: Skilltree) {
  }
}

/**
 * Load Skilltree Actions
 */
export class LoadSkilltreeAction implements Action {
  readonly type = LOAD_SKILLTREE;

  constructor(public payload: Skilltree) {
  }
}

/**
 * Copy Skilltree Actions
 */
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
 * Remove Book from Collection Actions
 */
export class SelectSkilltreeAction implements Action {
  readonly type = SELECT_SKILLTREE;

  constructor(public payload: string) {
  }
}

/**
 * Remove Book from Collection Actions
 */
export class UpdateSkilltreeInfoAction implements Action {
  readonly type = UPDATE_SKILLTREE_INFO;

  constructor(public skilltree: Skilltree, public oldId: string) {
  }
}

export type Actions
  = AddSkilltreeAction
  | LoadSkilltreeAction
  | CopySkilltreeAction
  | RemoveSkilltreeAction
  | SelectSkilltreeAction
  | UpdateSkilltreeInfoAction

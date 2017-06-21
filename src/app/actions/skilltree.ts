import { Action } from "@ngrx/store";
import { Skilltree } from "../models/Skilltree";

export const ADD_SKILLTREE = '[Skilltree] Add';
export const LOAD_SKILLTREE = '[Skilltree] Load';
export const COPY_SKILLTREE = '[Skilltree] Copy';
export const REMOVE_SKILLTREE = '[Skilltree] Remove';

/**
 * Add Book to Collection Actions
 */
export class AddSkilltreeAction implements Action {
  readonly type = ADD_SKILLTREE;

  constructor(public payload: Skilltree) {
  }
}

/**
 * Load Collection Actions
 */
export class LoadSkilltreeAction implements Action {
  readonly type = LOAD_SKILLTREE;

  constructor(public payload: Skilltree) {
  }
}

/**
 * Copy Collection Actions
 */
export class CopySkilltreeAction implements Action {
  readonly type = COPY_SKILLTREE;

  constructor(public payload: Skilltree) {
  }
}

/**
 * Remove Book from Collection Actions
 */
export class RemoveSkilltreeAction implements Action {
  readonly type = REMOVE_SKILLTREE;

  constructor(public payload: Skilltree) {
  }
}

export type Actions
  = AddSkilltreeAction
  | LoadSkilltreeAction
  | CopySkilltreeAction
  | RemoveSkilltreeAction

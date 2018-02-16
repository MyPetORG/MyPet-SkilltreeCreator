import { Action } from "@ngrx/store";
import { Skilltree } from "../../models/Skilltree";
import { Upgrade } from "../../models/Upgrade";

export const ADD_SKILLTREE = '[Skilltree] Add';
export const LOAD_SKILLTREE = '[Skilltree] Load';
export const LOAD_SKILLTREE_SUCCESS = '[Skilltree] Load Success';
export const COPY_SKILLTREE = '[Skilltree] Copy';
export const REMOVE_SKILLTREE = '[Skilltree] Remove';

export const SELECT_SKILLTREE = '[Skilltree] Select';
export const UPDATE_SKILLTREE_INFO = '[Skilltree] Update Info';

export const ADD_UPGRADE = '[Upgrade] Add';
export const LOAD_UPGRADES = '[Upgrade] Load';
export const UPDATE_UPGRADE = '[Upgrade] Update';

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
  readonly payload: { skilltree: Skilltree, upgrades: Upgrade[] };

  constructor(skilltree: Skilltree, upgrades: Upgrade[]) {
    this.payload = {skilltree, upgrades};
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
 * Select Skilltree Actions
 */
export class SelectSkilltreeAction implements Action {
  readonly type = SELECT_SKILLTREE;

  constructor(public payload: string) {
  }
}

/**
 * Update Skilltree Actions
 */
export class UpdateSkilltreeInfoAction implements Action {
  readonly type = UPDATE_SKILLTREE_INFO;
  readonly payload: { skilltree: Skilltree, oldId: string };

  constructor(skilltree: Skilltree, oldId: string) {
    this.payload.skilltree = skilltree;
    this.payload.oldId = oldId
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

export class LoadSkillUpgrades implements Action {
  readonly type = LOAD_UPGRADES;

  constructor(public payload: Upgrade[]) {
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
  | SelectSkilltreeAction
  | UpdateSkilltreeInfoAction
  | UpdateSkillUpgrade
  | AddSkillUpgrade
  | LoadSkillUpgrades

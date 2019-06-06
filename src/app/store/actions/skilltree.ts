import { createAction, props } from '@ngrx/store';
import { Skilltree } from '../../models/skilltree';

export const LOAD_SKILLTREE = 'LOAD_SKILLTREE';
export const LOAD_SKILLTREE_SUCCESS = 'LOAD_SKILLTREE_SUCCESS';
export const LOAD_SKILLTREE_FAILED = 'LOAD_SKILLTREE_FAILED';

export const LOAD_SKILLTREES = 'LOAD_SKILLTREES';
export const LOAD_SKILLTREES_SUCCESS = 'LOAD_SKILLTREES_SUCCESS';
export const LOAD_SKILLTREES_FAILED = 'LOAD_SKILLTREES_FAILED';

export const SAVE_SKILLTREES = 'SAVE_SKILLTREES';
export const SAVE_SKILLTREES_SUCCESS = 'SAVE_SKILLTREES_SUCCESS';
export const SAVE_SKILLTREES_FAILED = 'SAVE_SKILLTREES_FAILED';

export const IMPORT_SKILLTREE = 'IMPORT_SKILLTREE';
export const IMPORT_SKILLTREE_SUCCESS = 'IMPORT_SKILLTREE_SUCCESS';
export const IMPORT_SKILLTREE_FAILED = 'IMPORT_SKILLTREE_FAILED';

export const IMPORT_LEGACY_SKILLTREE = 'IMPORT_LEGACY_SKILLTREE';

export const ADD_SKILLTREE = 'ADD_SKILLTREE';
export const COPY_SKILLTREE = 'COPY_SKILLTREE';
export const REMOVE_SKILLTREE = 'REMOVE_SKILLTREE';
export const RENAME_SKILLTREE = 'RENAME_SKILLTREE';

export const UPDATE_SKILLTREE_ORDER = 'UPDATE_SKILLTREE_ORDER';
export const UPDATE_SKILLTREE_INFO = 'UPDATE_SKILLTREE_INFO';
export const UPDATE_SKILLTREE_UPGRADE = 'UPDATE_SKILLTREE_UPGRADE';

/**
 * Add Skilltree Actions
 */
export const addSkilltree = createAction(
  ADD_SKILLTREE,
  props<{ skilltree: Skilltree }>()
);

export const loadSkilltrees = createAction(
  LOAD_SKILLTREES,
  props<{ ignoredByUndo?: boolean }>()
);

export const loadSkilltreesFailed = createAction(
  LOAD_SKILLTREES_FAILED,
  props<{ error: any, ignoredByUndo?: boolean }>()
);

export const loadSkilltreesSuccess = createAction(
  LOAD_SKILLTREES_SUCCESS,
  props<{ ignoredByUndo?: boolean }>()
);

export const loadSkilltree = createAction(
  LOAD_SKILLTREE,
  props<{ ignoredByUndo?: boolean, skilltree: any }>()
);

export const loadSkilltreeSuccess = createAction(
  LOAD_SKILLTREE_SUCCESS,
  props<{ ignoredByUndo?: boolean, skilltree: Skilltree }>()
);

export const loadSkilltreeFailed = createAction(
  LOAD_SKILLTREE_FAILED,
  props<{ ignoredByUndo?: boolean, error: any }>()
);

export const saveSkilltrees = createAction(
  SAVE_SKILLTREES,
  props<{ ignoredByUndo?: boolean }>()
);

export const saveSkilltreesSuccess = createAction(
  SAVE_SKILLTREES_SUCCESS,
  props<{ ignoredByUndo?: boolean, result: any }>()
);

export const saveSkilltreesFailed = createAction(
  SAVE_SKILLTREES_FAILED,
  props<{ ignoredByUndo?: boolean, error: any }>()
);

export const importLegacySkilltree = createAction(
  IMPORT_LEGACY_SKILLTREE,
  props<{ skilltree: Skilltree }>()
);

export const importSkilltree = createAction(
  IMPORT_SKILLTREE,
  props<{ ignoredByUndo?: boolean, skilltreeData: any }>()
);

export const importSkilltreeSuccess = createAction(
  IMPORT_SKILLTREE_SUCCESS,
  props<{ ignoredByUndo?: boolean, skilltree: Skilltree }>()
);

export const importSkilltreeFailed = createAction(
  IMPORT_SKILLTREE_FAILED,
  props<{ ignoredByUndo?: boolean, error: any }>()
);

export const copySkilltree = createAction(
  COPY_SKILLTREE,
  props<{ skilltree: Skilltree }>()
);

export const updateSkilltreeOrder = createAction(
  UPDATE_SKILLTREE_ORDER,
  props<{ ignoredByUndo?: boolean, order: { id: string, changes: { order: number } }[] }>()
);

/**
 * Remove Skilltree Actions
 */

export const removeSkilltree = createAction(
  REMOVE_SKILLTREE,
  props<{ skilltree: Skilltree }>()
);

/**
 * Remove Skilltree Actions
 */
export const renameSkilltree = createAction(
  RENAME_SKILLTREE,
  props<{ newId: string, oldId: string }>()
);

/**
 * Update Skilltree Actions
 */

export const updateSkilltreeInfo = createAction(
  UPDATE_SKILLTREE_INFO,
  props<{ id: string, changes: any }>()
);

export const updateSkilltreeUpgrade = createAction(
  UPDATE_SKILLTREE_INFO,
  props<{ id: string, changes: any }>()
);

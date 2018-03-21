import { createSelector } from "reselect";
import * as fromRouter from "@ngrx/router-store";
import { ActionReducerMap } from "@ngrx/store";
import * as fromLayout from "./layout";
import * as fromSkilltree from "./skilltree";
import { Skilltree } from "../../models/skilltree";
import { SkillInfo } from "../../data/skills";
import * as fromUndoable from "./undoable";
import { InjectionToken } from "@angular/core";

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  layout: fromLayout.State;
  skilltree: fromUndoable.UndoableState<fromSkilltree.State>;
  router: fromRouter.RouterReducerState;
}

/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
export const reducers: ActionReducerMap<State> = {
  layout: fromLayout.reducer,
  skilltree: fromUndoable.undoable(fromSkilltree.reducer),
  router: fromRouter.routerReducer,
};

export const reducerToken = new InjectionToken<ActionReducerMap<State>>(
  'Registered Reducers'
);
Object.assign(reducerToken, reducers);

export function getReducers() {
  return reducers;
}


/**
 * Undoable Reducers
 */

export const getUndoableState = (state: State) => state.skilltree;
export const getPastStates = createSelector(getUndoableState, fromUndoable.getPastStates);
export const getPresent = createSelector(getUndoableState, fromUndoable.getPresentStates);
export const getFutureStates = createSelector(getUndoableState, fromUndoable.getFutureStates);

/**
 * Layout Reducers
 */
export const getLayoutState = (state: State) => state.layout;

export const getShowSidenav = createSelector(getLayoutState, fromLayout.getShowSidenav);
export const getTab = createSelector(getLayoutState, fromLayout.getTab);
export const getPremium = createSelector(getLayoutState, fromLayout.getPremium);
export const getSelectedSkill = createSelector(getLayoutState, fromLayout.getSelectedSkill);
export const getSelectedSkilltreeId = createSelector(getLayoutState, fromLayout.getSelectedSkilltreeId);
export const getLanguage = createSelector(getLayoutState, fromLayout.getLanguage);
export const isLoaded = createSelector(getLayoutState, fromLayout.isLoaded);

/**
 * Skilltree Reducers
 */
export const getSkilltreeState = getPresent;

export const getSkilltrees = createSelector(getSkilltreeState, fromSkilltree.selectSkilltreeEntities);
export const getSkilltreeNames = createSelector(getSkilltreeState, fromSkilltree.selectSkilltreeIds);

export const getSelectedSkilltree = createSelector(
  getSkilltrees,
  getSelectedSkilltreeId,
  (skilltreeEntities, skilltreeId) => skilltreeEntities[skilltreeId]
);

/**
 * Upgrade Reducers
 */

export const getSelectedUpgrades = createSelector(getSelectedSkilltree, getSelectedSkill, (skilltree: Skilltree, skill: SkillInfo) => skilltree ? skilltree.skills[skill.id] : []);

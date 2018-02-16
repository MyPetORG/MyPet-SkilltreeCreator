import { createSelector } from "reselect";
import * as fromRouter from "@ngrx/router-store";
import { ActionReducerMap } from "@ngrx/store";
import * as fromLayout from "./layout";
import * as fromSkilltree from "./skilltree";
import { Skilltree } from "../../models/Skilltree";
import { SkillInfo } from "../../data/Skills";

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  layout: fromLayout.State;
  skilltree: fromSkilltree.State;
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
  skilltree: fromSkilltree.reducer,
  router: fromRouter.routerReducer,
};

/**
 * Skilltree Reducers
 */
export const getSkilltreeState = (state: State) => state.skilltree;

export const getSkilltrees = createSelector(getSkilltreeState, fromSkilltree.selectSkilltreeEntities);
export const getSelectedSkilltreeId = createSelector(getSkilltreeState, fromSkilltree.getSelectedSkilltreeId);
export const getSelectedSkilltree = createSelector(
  getSkilltrees,
  getSelectedSkilltreeId,
  (skilltreeEntities, skilltreeId) => skilltreeEntities[skilltreeId]
);

/**
 * Layout Reducers
 */
export const getLayoutState = (state: State) => state.layout;

export const getShowSidenav = createSelector(getLayoutState, fromLayout.getShowSidenav);
export const getTab = createSelector(getLayoutState, fromLayout.getTab);
export const getSelectedSkill = createSelector(getLayoutState, fromLayout.getSelectedSkill);

/**
 * Upgrade Reducers
 */

export const getSelectedUpgrades = createSelector(getSelectedSkilltree, getSelectedSkill, (skilltree: Skilltree, skill: SkillInfo) => skilltree ? skilltree.skills[skill.name] : []);
import { createSelector } from "reselect";
import * as fromRouter from "@ngrx/router-store";
import { ActionReducerMap } from "@ngrx/store";
import * as fromLayout from "./layout";
import * as fromSkilltree from "./skilltree";
import { Skilltree } from "../models/Skilltree";

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

export const getSkilltrees = createSelector(getSkilltreeState, fromSkilltree.getSkilltrees);
export const getSelectedSkilltree = createSelector(getSkilltreeState, fromSkilltree.getSelectedSkilltree);
export const getSelectedSkilltreeId = createSelector(getSkilltreeState, fromSkilltree.getSelectedSkilltreeId);

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
export const getUpgrades = createSelector(getSkilltreeState, fromSkilltree.getUpgrades);

export const getSelectedUpgradeIds = createSelector(getSelectedSkill, getSelectedSkilltree, (skill, skilltree: Skilltree) => {
  console.log("skilltree --", skilltree);
  return skilltree ? skilltree.skills[skill.name] : [];
});

export const getSelectedUpgrades = createSelector(getUpgrades, getSelectedUpgradeIds, (upgrades, ids) => {
  console.log("type", typeof ids);
  if (!ids) {
    return {}
  }
  return ids.map(id => upgrades[id]);
});

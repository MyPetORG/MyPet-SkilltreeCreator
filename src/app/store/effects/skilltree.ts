import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import "rxjs/add/operator/withLatestFrom";
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { tap } from "rxjs/operators";
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import * as SkilltreeActions from "../actions/skilltree";
import { SkilltreeLoaderService } from "../../services/skilltree-loader.service";
import { SkilltreeSaverService } from "../../services/skilltree-saver.service";
import * as LayoutActions from "../actions/layout";
import { Router } from "@angular/router";
import * as Reducers from "../reducers";
import { MatSnackBar } from "@angular/material";
import { Skilltree } from "../../models/Skilltree";

@Injectable()
export class SkilltreeEffects {
  constructor(private actions$: Actions,
              private skilltreeLoader: SkilltreeLoaderService,
              private skilltreeSaver: SkilltreeSaverService,
              private store: Store<Reducers.State>,
              public snackBar: MatSnackBar,
              private router: Router) {
  }

  @Effect()
  loadSkilltree$: Observable<Action> = this.actions$
    .ofType(SkilltreeActions.LOAD_SKILLTREE)
    .switchMap((action: SkilltreeActions.LoadSkilltreeAction) => {
      let result = this.skilltreeLoader.loadSkilltree(action.payload);
      return of(new SkilltreeActions.LoadSkilltreeSuccessAction(result));
    });

  @Effect()
  saveSkilltree$: Observable<Action> = this.actions$
    .ofType(SkilltreeActions.SAVE_SKILLTREES)
    .withLatestFrom(this.store.select(Reducers.getSkilltrees))
    .switchMap(([action, state]) => {
      let skilltrees: Skilltree[] = [];
      Object.keys(state).forEach(id => {
        skilltrees.push(state[id]);
      });
      return this.skilltreeSaver.saveSkilltrees(skilltrees)
        .map(res => new SkilltreeActions.SaveSkilltreesSuccessAction(res))
        .catch(err => of(new SkilltreeActions.SaveSkilltreesFailedAction(err)));
    });

  @Effect({dispatch: false})
  saveSkilltreeSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(SkilltreeActions.SAVE_SKILLTREES_SUCCESS),
    tap((action: SkilltreeActions.SaveSkilltreesSuccessAction) => {
      this.snackBar.open("Skilltrees were saved successfully", "Success", {
        duration: 2000,
      });
    })
  );

  @Effect({dispatch: false})
  saveSkilltreeFailed$: Observable<Action> = this.actions$.pipe(
    ofType(SkilltreeActions.SAVE_SKILLTREES_FAILED),
    tap((action: SkilltreeActions.SaveSkilltreesFailedAction) => {
      this.snackBar.open("An error occured while saving the skilltrees!", "ERROR", {
        duration: 2000,
      });
      console.log("Skilltree saving failed", action.error);
    })
  );

  @Effect({dispatch: false})
  renameSkilltree$: Observable<Action> = this.actions$.pipe(
    ofType(SkilltreeActions.RENAME_SKILLTREE),
    tap((action: SkilltreeActions.RenameSkilltreeAction) => {
      console.log("effect:", action);
      this.router.navigate(["st", action.newId]).then(() => {
        this.snackBar.open(action.oldId + " was renamed to " + action.newId, "Skilltree", {
          duration: 2000,
        });
        this.store.dispatch(new LayoutActions.SwitchTabAction(1));
      });
    })
  );
}

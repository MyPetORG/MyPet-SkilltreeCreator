import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as Skilltree from "../actions/skilltree";
import { RenameSkilltreeAction } from "../actions/skilltree";
import { SkilltreeLoaderService } from "../../services/skilltree-loader.service";
import { tap } from "rxjs/operators";
import * as LayoutActions from "../actions/layout";
import { Router } from "@angular/router";
import * as Reducers from "../reducers";
import { MatSnackBar } from "@angular/material";

@Injectable()
export class SkilltreeEffects {
  constructor(private actions$: Actions,
              private skilltreeLoader: SkilltreeLoaderService,
              private store: Store<Reducers.State>,
              public snackBar: MatSnackBar,
              private router: Router) {
  }

  @Effect()
  loadSkilltree$: Observable<Action> = this.actions$
    .ofType(Skilltree.LOAD_SKILLTREE)
    .debounceTime(300)

    .switchMap((action: Skilltree.LoadSkilltreeAction) => {
      console.log("query", action);

      let result = this.skilltreeLoader.loadSkilltree(action.payload);

      return of(new Skilltree.LoadSkilltreeSuccessAction(result));
    });

  @Effect({dispatch: false})
  renameSkilltree$: Observable<Action> = this.actions$.pipe(
    ofType(Skilltree.RENAME_SKILLTREE),
    tap((action: RenameSkilltreeAction) => {
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

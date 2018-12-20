import { defer, EMPTY, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import * as SkilltreeActions from "../actions/skilltree";
import { ImportSkilltreeAction } from "../actions/skilltree";
import { SkilltreeLoaderService } from "../../services/skilltree-loader.service";
import { SkilltreeSaverService } from "../../services/skilltree-saver.service";
import * as LayoutActions from "../actions/layout";
import { Router } from "@angular/router";
import * as Reducers from "../reducers";
import { MatSnackBar } from "@angular/material";
import { Skilltree } from "../../models/skilltree";
import { TranslateService } from "@ngx-translate/core";
import { UNDO } from "../reducers/undoable";

@Injectable()
export class SkilltreeEffects {
  constructor(private actions$: Actions,
              private skilltreeLoader: SkilltreeLoaderService,
              private skilltreeSaver: SkilltreeSaverService,
              private store: Store<Reducers.State>,
              private snackBar: MatSnackBar,
              private translate: TranslateService,
              private router: Router) {
  }

  @Effect()
  orderSkilltree$: Observable<Action> = this.actions$.pipe(
    ofType(
      SkilltreeActions.LOAD_SKILLTREE_SUCCESS,
      SkilltreeActions.ADD_SKILLTREE,
      SkilltreeActions.REMOVE_SKILLTREE,
      SkilltreeActions.IMPORT_SKILLTREE_SUCCESS,
      SkilltreeActions.IMPORT_LEGACY_SKILLTREE,
    ),
    withLatestFrom(this.store.pipe(select(Reducers.getSkilltrees))),
    withLatestFrom(this.store.pipe(select(Reducers.isLoaded))),
    switchMap(([[action, state], loaded]) => {
      if (loaded) {
        let skilltrees = [];
        Object.keys(state).forEach(id => {
          skilltrees.push(JSON.parse(JSON.stringify(state[id])));
        });
        skilltrees.sort((a, b) => {
          return a.order - b.order;
        });
        let index = 0;
        skilltrees.forEach((st) => {
          st.order = index++;
        });
        let changes: { id: string, changes: { order: number } }[] = [];
        skilltrees.forEach((st) => {
          if (st.order != state[st.id].order) {
            changes.push({id: st.id, changes: {order: st.order}});
          }
        });
        return of(new SkilltreeActions.UpdateSkilltreeOrderAction(changes));
      }
      return EMPTY;
    }),);

  @Effect()
  importSkilltree$: Observable<Action> = this.actions$.pipe(
    ofType(SkilltreeActions.IMPORT_SKILLTREE),
    withLatestFrom(this.store.pipe(select(Reducers.getSkilltrees))),
    switchMap(([action, state]: [ImportSkilltreeAction, any]) => {
      let skilltreeIds: string[] = [];
      Object.keys(state).forEach(id => {
        skilltreeIds.push(id);
      });
      return this.skilltreeLoader.loadSkilltree(action.skilltreeData).pipe(
        map(res => {
          if (skilltreeIds.indexOf(res.id) == -1) {
            return new SkilltreeActions.ImportSkilltreeSuccessAction(res);
          } else {
            return new SkilltreeActions.ImportSkilltreeFailedAction({type: "DUPLICATE", data: res.id});
          }
        }),
        catchError(err => {
          return of(new SkilltreeActions.ImportSkilltreeFailedAction(err));
        }),);
    }),);

  @Effect({dispatch: false})
  importSkilltreesFailed$: Observable<Action> = this.actions$.pipe(
    ofType(SkilltreeActions.IMPORT_SKILLTREE_FAILED),
    tap((action: SkilltreeActions.ImportSkilltreeFailedAction) => {
      switch (action.error.type) {
        case "INVALID":
          this.translate.get("EFFECT__IMPORT_SKILLTREE_FAILED__INVALID")
            .subscribe((trans) => {
              this.snackBar.open(trans, null, {duration: 2000,});
            });
          break;
        case "DUPLICATE":
          this.translate.get(
            "EFFECT__IMPORT_SKILLTREE_FAILED__DUPLICATE",
            {id: action.error.data})
            .subscribe((trans) => {
              this.snackBar.open(trans, null, {duration: 2000,});
            });
          break;
        default:
          console.error(action);
      }
    })
  );

  @Effect({dispatch: false})
  importSkilltreesSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(SkilltreeActions.IMPORT_SKILLTREE_SUCCESS),
    tap(() => {
      this.translate.get("EFFECT__IMPORT_SKILLTREE_SUCCESS")
        .subscribe((trans) => {
          this.snackBar.open(trans, null, {duration: 2000,});
        });
    })
  );

  @Effect()
  loadSkilltree$: Observable<Action> = this.actions$.pipe(
    ofType(SkilltreeActions.LOAD_SKILLTREE),
    switchMap((action: SkilltreeActions.LoadSkilltreeAction) => {
      return this.skilltreeLoader.loadSkilltree(action.payload).pipe(
        map((result) => new SkilltreeActions.LoadSkilltreeSuccessAction(result)),
        catchError(err => of(new SkilltreeActions.LoadSkilltreeFailedAction(err))),);
    }));

  @Effect()
  loadSkilltrees$: Observable<Action> = this.actions$.pipe(
    ofType(SkilltreeActions.LOAD_SKILLTREES),
    switchMap(() => {
      return this.skilltreeLoader.loadSkilltrees().pipe(
        map(res => res as any[]),
        map(res => {
          res.forEach(st => this.store.dispatch(new SkilltreeActions.LoadSkilltreeAction(st)));
          return new SkilltreeActions.LoadSkilltreesSuccessAction();
        }),
        catchError(err => of(new SkilltreeActions.LoadSkilltreesFailedAction(err))),);
    }));

  @Effect()
  loadSkilltreesSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(SkilltreeActions.LOAD_SKILLTREES_SUCCESS),
    map(() => {
        this.translate.get("EFFECT__LOAD_SKILLTREE_SUCCESS")
          .subscribe((trans) => {
              this.snackBar.open(trans, null, {duration: 2000,});
            }
          );
        return new LayoutActions.AppLoadedAction();
      }
    ));

  @Effect()
  loadSkilltreesFailed$: Observable<Action> = this.actions$.pipe(
    ofType(SkilltreeActions.LOAD_SKILLTREES_FAILED),
    map(() => {
        this.translate.get("EFFECT__LOAD_SKILLTREE_FAILED")
          .subscribe((trans) => {
            this.snackBar.open(trans, null, {duration: 2000,});
          });
        return new LayoutActions.AppLoadedAction();
      }
    ));

  @Effect()
  saveSkilltree$: Observable<Action> = this.actions$.pipe(
    ofType(SkilltreeActions.SAVE_SKILLTREES),
    withLatestFrom(this.store.pipe(select(Reducers.getSkilltrees))),
    switchMap(([action, state]) => {
      let skilltrees: Skilltree[] = [];
      Object.keys(state).forEach(id => {
        skilltrees.push(state[id]);
      });
      return this.skilltreeSaver.saveSkilltrees(skilltrees).pipe(
        map(res => new SkilltreeActions.SaveSkilltreesSuccessAction(res)),
        catchError(err => of(new SkilltreeActions.SaveSkilltreesFailedAction(err))),);
    }),);

  @Effect({dispatch: false})
  saveSkilltreeSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(SkilltreeActions.SAVE_SKILLTREES_SUCCESS),
    tap(() => {
      this.translate.get("EFFECT__SAVE_SKILLTREE_SUCCESS")
        .subscribe((trans) => {
          this.snackBar.open(trans, null, {duration: 2000});
        });
    })
  );

  @Effect({dispatch: false})
  saveSkilltreeFailed$: Observable<Action> = this.actions$.pipe(
    ofType(SkilltreeActions.SAVE_SKILLTREES_FAILED),
    tap((action: SkilltreeActions.SaveSkilltreesFailedAction) => {
      this.translate.get("EFFECT__SAVE_SKILLTREE_FAILED")
        .subscribe((trans) => {
          this.snackBar.open(trans, null, {duration: 2000,});
        });
      console.log("Skilltree saving failed", action.error);
    })
  );

  @Effect({dispatch: false})
  renameSkilltree$: Observable<Action> = this.actions$.pipe(
    ofType(SkilltreeActions.RENAME_SKILLTREE),
    tap((action: SkilltreeActions.RenameSkilltreeAction) => {
      this.router.navigate(["st", action.newId]).then(() => {
        this.translate.get(
          "EFFECT__RENAME_SKILLTREE__SUCCESS",
          {old: action.oldId, "new": action.newId}
        ).subscribe((trans) => {
          this.snackBar.open(trans, null, {duration: 2000,});
        });
        this.store.dispatch(new LayoutActions.SwitchTabAction(1));
      });
    })
  );

  @Effect() init$: Observable<SkilltreeActions.LoadSkilltreesAction> = defer(() => {
    return of(new SkilltreeActions.LoadSkilltreesAction());
  });

  @Effect()
  undo$: Observable<Action> = this.actions$.pipe(
    ofType(UNDO),
    withLatestFrom(this.store.pipe(select(Reducers.getSkilltrees))),
    withLatestFrom(this.store.pipe(select(Reducers.getSelectedSkilltreeId))),
    switchMap(([[action, state], selected]) => { //
      if (!state[selected]) {
        this.router.navigate(["/"]);
      }
      return EMPTY;
    }),);
}

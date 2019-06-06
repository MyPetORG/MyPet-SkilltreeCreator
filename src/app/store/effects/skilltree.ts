import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Skilltree } from '../../models/skilltree';
import { SkilltreeLoaderService } from '../../services/skilltree-loader.service';
import { SkilltreeSaverService } from '../../services/skilltree-saver.service';
import { appLoaded, switchTab } from '../actions/layout';
import * as SkilltreeActions from '../actions/skilltree';
import * as Reducers from '../reducers';
import { REDO, UNDO } from '../reducers/undoable';

@Injectable()
export class SkilltreeEffects implements OnInitEffects {
  constructor(private actions$: Actions,
              private skilltreeLoader: SkilltreeLoaderService,
              private skilltreeSaver: SkilltreeSaverService,
              private store: Store<Reducers.State>,
              private snackBar: MatSnackBar,
              private translate: TranslateService,
              private router: Router) {
  }

  orderSkilltree$ = createEffect(() => this.actions$.pipe(
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
            changes.push({ id: st.id, changes: { order: st.order } });
          }
        });
        return of(SkilltreeActions.updateSkilltreeOrder({ order: changes, ignoredByUndo: true }));
      }
      return EMPTY;
    })
  ));

  importSkilltree$ = createEffect(() => this.actions$.pipe(
    ofType(SkilltreeActions.importSkilltree),
    withLatestFrom(this.store.pipe(select(Reducers.getSkilltrees))),
    switchMap(([action, state]) => {
      let skilltreeIds: string[] = [];
      Object.keys(state).forEach(id => {
        skilltreeIds.push(id);
      });
      return this.skilltreeLoader.loadSkilltree(action.skilltreeData).pipe(
        map(skilltree => {
          if (skilltreeIds.indexOf(skilltree.id) == -1) {
            return SkilltreeActions.importSkilltreeSuccess({
              skilltree,
              ignoredByUndo: true
            });
          } else {
            return SkilltreeActions.importSkilltreeFailed({
              error: { type: 'DUPLICATE', data: skilltree.id },
              ignoredByUndo: true
            });
          }
        }),
        catchError(error => {
          return of(SkilltreeActions.importSkilltreeFailed({ error, ignoredByUndo: true }));
        }),);
    })
  ));

  importSkilltreesFailed$ = createEffect(() => this.actions$.pipe(
    ofType(SkilltreeActions.importSkilltreeFailed),
    tap((action) => {
      switch (action.error.type) {
        case 'INVALID':
          this.translate.get('EFFECT__IMPORT_SKILLTREE_FAILED__INVALID')
            .subscribe((trans) => {
              this.snackBar.open(trans, null, { duration: 2000, });
            });
          break;
        case 'DUPLICATE':
          this.translate.get(
            'EFFECT__IMPORT_SKILLTREE_FAILED__DUPLICATE',
            { id: action.error.data })
            .subscribe((trans) => {
              this.snackBar.open(trans, null, { duration: 2000, });
            });
          break;
        default:
          console.error(action);
      }
    })
  ), { dispatch: false });

  importSkilltreesSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(SkilltreeActions.importSkilltreeSuccess),
    tap(() => {
      this.translate.get('EFFECT__IMPORT_SKILLTREE_SUCCESS')
        .subscribe((trans) => {
          this.snackBar.open(trans, null, { duration: 2000, });
        });
    })
  ), { dispatch: false });

  loadSkilltree$ = createEffect(() => this.actions$.pipe(
    ofType(SkilltreeActions.loadSkilltree),
    switchMap((action) => {
      return this.skilltreeLoader.loadSkilltree(action.skilltree).pipe(
        map((skilltree) => SkilltreeActions.loadSkilltreeSuccess({ ignoredByUndo: action.ignoredByUndo, skilltree })),
        catchError(error => of(SkilltreeActions.loadSkilltreeFailed({ error, ignoredByUndo: true }))),);
    })
  ));

  loadSkilltrees$ = createEffect(() => this.actions$.pipe(
    ofType(SkilltreeActions.loadSkilltrees),
    switchMap(() => {
      return this.skilltreeLoader.loadSkilltrees().pipe(
        map(res => res as any[]),
        map(res => {
          res.forEach(skilltree => this.store.dispatch(SkilltreeActions.loadSkilltree({
            skilltree,
            ignoredByUndo: true
          })));
          return SkilltreeActions.loadSkilltreesSuccess({ ignoredByUndo: true });
        }),
        catchError(error => of(SkilltreeActions.loadSkilltreesFailed({ error, ignoredByUndo: true }))),);
    })
  ));

  loadSkilltreesSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(SkilltreeActions.loadSkilltreesSuccess),
    map(() => {
      this.translate.get('EFFECT__LOAD_SKILLTREE_SUCCESS')
          .subscribe((trans) => {
            this.snackBar.open(trans, null, { duration: 2000, });
            }
          );
      return appLoaded();
      }
    )
  ));

  loadSkilltreesFailed$ = createEffect(() => this.actions$.pipe(
    ofType(SkilltreeActions.loadSkilltreeFailed),
    map(() => {
      this.translate.get('EFFECT__LOAD_SKILLTREE_FAILED')
          .subscribe((trans) => {
            this.snackBar.open(trans, null, { duration: 2000, });
          });
      return appLoaded();
      }
    )
  ));

  saveSkilltree$ = createEffect(() => this.actions$.pipe(
    ofType(SkilltreeActions.saveSkilltrees),
    withLatestFrom(this.store.pipe(select(Reducers.getSkilltrees))),
    switchMap(([action, state]) => {
      let skilltrees: Skilltree[] = [];
      Object.keys(state).forEach(id => {
        skilltrees.push(state[id]);
      });
      return this.skilltreeSaver.saveSkilltrees(skilltrees).pipe(
        map(result => SkilltreeActions.saveSkilltreesSuccess({ result, ignoredByUndo: true })),
        catchError(error => of(SkilltreeActions.saveSkilltreesFailed({ error, ignoredByUndo: true }))),);
    })
  ));

  saveSkilltreeSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(SkilltreeActions.saveSkilltreesSuccess),
    tap(() => {
      this.translate.get('EFFECT__SAVE_SKILLTREE_SUCCESS')
        .subscribe((trans) => {
          this.snackBar.open(trans, null, { duration: 2000 });
        });
    })
  ), { dispatch: false });

  saveSkilltreeFailed$ = createEffect(() => this.actions$.pipe(
    ofType(SkilltreeActions.saveSkilltreesFailed),
    tap((action) => {
      this.translate.get('EFFECT__SAVE_SKILLTREE_FAILED')
        .subscribe((trans) => {
          this.snackBar.open(trans, null, { duration: 2000, });
        });
      console.log('Skilltree saving failed', action.error);
    })
  ), { dispatch: false });

  renameSkilltree$ = createEffect(() => this.actions$.pipe(
    ofType(SkilltreeActions.renameSkilltree),
    tap((action) => {
      this.router.navigate(['st', action.newId]).then(() => {
        this.translate.get(
          'EFFECT__RENAME_SKILLTREE__SUCCESS',
          { old: action.oldId, 'new': action.newId }
        ).subscribe((trans) => {
          this.snackBar.open(trans, null, { duration: 2000, });
        });
        this.store.dispatch(switchTab({ tab: 1 }));
      });
    })
  ), { dispatch: false });

  undoredo$ = createEffect(() => this.actions$.pipe(
    ofType(UNDO, REDO),
    withLatestFrom(this.store.pipe(select(Reducers.getSkilltrees))),
    withLatestFrom(this.store.pipe(select(Reducers.getSelectedSkilltreeId))),
    switchMap(([[action, state], selected]) => { //
      if (!state[selected]) {
        this.router.navigate(['/']);
      }
      return EMPTY;
    })
  ));

  ngrxOnInitEffects(): Action {
    return SkilltreeActions.loadSkilltrees({ ignoredByUndo: true });
  }
}

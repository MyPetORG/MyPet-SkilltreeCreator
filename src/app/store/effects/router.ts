import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import * as Reducers from '../reducers';

@Injectable()
export class RouterEffects {
  constructor(private actions$: Actions,
              private store: Store<Reducers.State>,
              private snackBar: MatSnackBar,
              private translate: TranslateService,
              private router: Router) {
  }

  importSkilltreesFailed$ = createEffect(() => this.actions$.pipe(
    ofType('ROUTER_CANCEL'),
    tap((action: Action) => {
      this.router.navigate(['/']);
    })
  ), { dispatch: false });
}

import { Observable } from 'rxjs';
import { tap } from "rxjs/operators";
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Router } from "@angular/router";
import * as Reducers from "../reducers";
import { MatSnackBar } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class RouterEffects {
  constructor(private actions$: Actions,
              private store: Store<Reducers.State>,
              private snackBar: MatSnackBar,
              private translate: TranslateService,
              private router: Router) {
  }

  @Effect({dispatch: false})
  importSkilltreesFailed$: Observable<Action> = this.actions$.pipe(
    ofType('ROUTER_CANCEL'),
    tap((action: Action) => {
      this.router.navigate(["/"])
    })
  );
}

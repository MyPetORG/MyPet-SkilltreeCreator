import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as Skilltree from "../actions/skilltree";
import { SkilltreeLoaderService } from "../services/skilltree-loader.service";

@Injectable()
export class SkilltreeEffects {

  @Effect()
  loadSkilltree$: Observable<Action> = this.actions$
    .ofType(Skilltree.LOAD_SKILLTREE)
    .debounceTime(300)

    .switchMap((action: Skilltree.LoadSkilltreeAction) => {
      console.log("query", action);

      let result = this.skilltreeLoader.loadSkilltree(action.payload);

      return of(new Skilltree.LoadSkilltreeSuccessAction(result.skilltree, result.upgrades));
    });

  constructor(private actions$: Actions, private skilltreeLoader: SkilltreeLoaderService) {
  }
}

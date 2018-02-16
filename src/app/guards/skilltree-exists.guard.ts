import "rxjs/add/operator/take";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/let";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ActivatedRouteSnapshot, CanActivate } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import * as Reducers from "../store/reducers/index";

@Injectable()
export class SkilltreeExistsGuard implements CanActivate {
  constructor(private store: Store<Reducers.State>) {
  }

  hasSkilltree(id: string): Observable<boolean> {
    return this.store.select(Reducers.getSkilltrees)
      .map(skilltrees => !!skilltrees[id])
      .take(1)
      .switchMap(hasSkilltree => {
        return of(hasSkilltree);
      });
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.hasSkilltree(route.params['id']);
  }
}

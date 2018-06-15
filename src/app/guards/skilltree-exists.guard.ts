import { map, take, takeUntil } from 'rxjs/operators';
import "rxjs/add/operator/take";
import "rxjs/add/operator/map";
import "rxjs/add/operator/withLatestFrom";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ActivatedRouteSnapshot, CanActivate } from "@angular/router";
import { AsyncSubject, Observable } from "rxjs";
import * as Reducers from "../store/reducers/index";

@Injectable()
export class SkilltreeExistsGuard implements CanActivate {
  constructor(private store: Store<Reducers.State>) {
  }

  hasSkilltree(id: string): Observable<boolean> {
    let sub = new AsyncSubject<boolean>();
    let obs = sub.asObservable();

    this.store.select(Reducers.isLoaded).pipe(
      takeUntil(obs))
      .subscribe(loaded => {
        if (loaded) {
          this.store.select(Reducers.getSkilltrees).pipe(
            map(skilltrees => {
              return !!skilltrees[id];
            }),
            take(1),
            map(hasSkilltree => {
              sub.next(hasSkilltree);
              sub.complete();
              return hasSkilltree;
            }),)
            .subscribe();
        }
      });
    return obs;
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.hasSkilltree(route.params['id']);
  }
}

import { filter, map, take } from 'rxjs/operators';
import "rxjs/add/operator/take";
import "rxjs/add/operator/map";
import "rxjs/add/operator/withLatestFrom";
import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import * as Reducers from "../store/reducers/index";

@Injectable()
export class SkilltreeExistsGuard implements CanActivate {
  constructor(
    private store: Store<Reducers.State>,
    private router: Router,
  ) {
  }

  hasSkilltree(id: string): Observable<boolean> {
    return this.store.pipe(
      select(state => {
        return {loaded: Reducers.isLoaded(state), skilltrees: Reducers.getSkilltrees(state)};
      }),
      filter((combinedData) => {
        return combinedData.loaded;
      }),
      map(combinedData => {
        return combinedData.skilltrees;
      }),
      map(skilltrees => {
        return !!skilltrees[id];
      }),
      take(1),
      map(hasSkilltree => {
        return hasSkilltree;
      })
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    return this.hasSkilltree(route.params['id']).pipe().toPromise().then(hasSkilltree => {
      if (!hasSkilltree) {
        return this.router.navigate(['/']).then(() => false);
      }
      return hasSkilltree;
    });
  }
}

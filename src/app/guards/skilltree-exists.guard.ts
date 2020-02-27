import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';
import { SkilltreeQuery } from '../stores/skilltree/skilltree.query';

@Injectable()
export class SkilltreeExistsGuard implements CanActivate {
  constructor(
    private router: Router,
    private skilltreeQuery: SkilltreeQuery,
  ) {
  }

  hasSkilltree(id: string): Observable<boolean> {
    return this.skilltreeQuery.selectLoading().pipe(
      filter(loading => !loading),
      switchMap(() => this.skilltreeQuery.skiltreeIds$),
      map(ids => ids.indexOf(id) !== -1),
      first(),
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.hasSkilltree(route.params['id']).pipe(
      tap(skilltreeExists => {
        if (!skilltreeExists) {
          this.router.navigate(['/']).then(() => false);
        }
      }),
    );
  }
}

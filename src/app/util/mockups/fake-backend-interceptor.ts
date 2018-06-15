import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';


import { CombatSkilltree, FarmSkilltree, PvpSkilltree, RideSkilltree, UtilitySkilltree } from "./example-skilltrees";

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url.startsWith('/api')) {
      if (request.url.startsWith('/api/skilltrees/save') && request.method === 'POST') {
        console.log(request.body);
        let fail = false;
        if (fail) {
          return observableThrowError('ERROR');
        } else {
          return observableOf(new HttpResponse({status: 200, body: {message: "DONE"}}));
        }
      }

      if (request.url.startsWith('/api/skilltrees') && request.method === 'GET') {
        return observableOf(new HttpResponse({
          status: 200,
          body: [CombatSkilltree, FarmSkilltree, PvpSkilltree, RideSkilltree, UtilitySkilltree]
        }));
      }
    }

    return next.handle(request);
  }
}

export let fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};

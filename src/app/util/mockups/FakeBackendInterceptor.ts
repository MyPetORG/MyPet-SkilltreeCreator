import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/dematerialize';
import { BeaconSkilltree, RideSkilltree } from "./ExampleSkilltrees";

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url.startsWith('/api')) {
      if (request.url.startsWith('/api/skilltrees/save') && request.method === 'POST') {
        console.log(request.body);
        if (1 == 1) {
          let body = "";
          return Observable.of(new HttpResponse({status: 200, body: body}));
        } else {
          return Observable.throw('ERROR');
        }
      }

      if (request.url.startsWith('/api/skilltrees') && request.method === 'GET') {
        return Observable.of(new HttpResponse({status: 200, body: [RideSkilltree, BeaconSkilltree]}));
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

import { ErrorHandler, Injectable } from '@angular/core';

import * as Sentry from '@sentry/browser';
import { environment } from '../../environments/environment';

@Injectable()
export class ErrorReporterService implements ErrorHandler {

  constructor() {
    Sentry.init({
      dsn: 'https://94f8a267877b4ab1a40aa5b379c9174e@sentry.io/1372016',
      environment: environment.production ? 'production' : 'development',
      release: environment.version,
    });
  }

  handleError(error) {
    if (environment.sentry) {
      Sentry.captureException(error.originalError || error);
    }
    throw error;
  }

  sendError(error) {
    if (environment.sentry) {
      Sentry.captureException(error.originalError || error);
    }
  }
}

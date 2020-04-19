import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { fakeBackendProvider } from '../app/util/mockups/fake-backend-interceptor';
import { APP_VERSION } from '../version';

export const environment = {
  production: false,
  sentry: false,
  providers: [fakeBackendProvider],
  imports: [AkitaNgDevtools],
  websocketUrl: 'localhost:64712',
  version: 'DEV-' + APP_VERSION,
};

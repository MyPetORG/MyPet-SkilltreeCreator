import { APP_VERSION } from '../version';

export const environment = {
  production: false,
  sentry: false,
  providers: [],
  websocketUrl: 'localhost:64712',
  version: 'DEV-PROXY-' + APP_VERSION
};

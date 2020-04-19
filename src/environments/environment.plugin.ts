import { APP_VERSION } from '../version';

export const environment = {
  production: true,
  sentry: true,
  providers: [],
  imports: [],
  websocketUrl: location.host,
  version: 'PLUGIN-' + APP_VERSION,
};

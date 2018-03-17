import { APP_VERSION } from "../version";

export const environment = {
  production: true,
  providers: [],
  websocketUrl: location.host,
  version: "PROD-" + APP_VERSION
};

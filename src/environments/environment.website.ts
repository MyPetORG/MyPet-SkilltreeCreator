import { fakeBackendProvider } from "../app/util/mockups/fake-backend-interceptor";
import { APP_VERSION } from "../version";

export const environment = {
  production: true,
  providers: [fakeBackendProvider],
  websocketUrl: null,
  version: "WS-" + APP_VERSION
};
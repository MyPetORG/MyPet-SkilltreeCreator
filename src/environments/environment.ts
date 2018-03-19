import { fakeBackendProvider } from "../app/util/mockups/fake-backend-interceptor";
import { APP_VERSION } from "../version";

export const environment = {
  production: false,
  providers: [fakeBackendProvider],
  websocketUrl: "localhost:64712",
  version: "DEV-" + APP_VERSION
};

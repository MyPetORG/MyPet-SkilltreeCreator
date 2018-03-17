import { fakeBackendProvider } from "../app/util/mockups/FakeBackendInterceptor";
import { APP_VERSION } from "../version";

export const environment = {
  production: false,
  providers: [fakeBackendProvider],
  websocketUrl: "localhost:64712",
  version: "DEV-" + APP_VERSION
};

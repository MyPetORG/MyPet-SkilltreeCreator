import { fakeBackendProvider } from "../app/util/mockups/FakeBackendInterceptor";

declare var APP_VERSION: string;

export const environment = {
  production: false,
  providers: [fakeBackendProvider],
  websocketUrl: "localhost:64712",
  version: "DEV-" + APP_VERSION
};

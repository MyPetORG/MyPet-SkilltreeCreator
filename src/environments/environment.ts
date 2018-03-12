import { fakeBackendProvider } from "../app/util/mockups/FakeBackendInterceptor";

export const environment = {
  production: false,
  providers: [fakeBackendProvider],
  websocketUrl: "localhost:64712",
};

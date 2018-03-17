declare var APP_VERSION: string;

export const environment = {
  production: true,
  providers: [],
  websocketUrl: location.host,
  version: "PLUGIN-" + APP_VERSION
};

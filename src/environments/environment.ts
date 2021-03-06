// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { AppEnvironment } from "./env.types";

export const environment: AppEnvironment = {
    production: false,
    service: {
        //apiUrl: "http://localhost:8080/v1",
        apiUrl: "https://smrpo.mjamsek.com/v1",
        //authUrl: "http://localhost:8080",
        authUrl: "https://smrpo.mjamsek.com",
        wsUrl: "wss://smrpo.mjamsek.com/ws/sync",
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

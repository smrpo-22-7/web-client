import { InjectionToken } from "@angular/core";
import { environment } from "@environment/environment";
import { AuthConfig } from "@lib";

export const AUTH_CONFIG = new InjectionToken<AuthConfig>("authConfig", {
    providedIn: "root",
    factory: () => {
        const authUrl = environment.service.authUrl;
        
        return {
            issuer: authUrl,
            authorizationUrl: authUrl + "/protocol/oidc/auth",
            tokenUrl: authUrl + "/protocol/oidc/token",
            endSessionUrl: authUrl + "/protocol/oidc/logout",
            sessionIframeUrl: authUrl + "/session-iframe",
            refreshTokenSecondsBefore: environment.options?.refreshTokenSecondsBefore || 10,
            checkSessionEverySeconds: environment.options?.checkSessionEverySeconds || 5,
        };
    }
});

export const API_URL = new InjectionToken<string>("apiUrl", {
    providedIn: "root",
    factory: () => environment.service.apiUrl
});

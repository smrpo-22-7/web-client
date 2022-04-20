import { Inject, Injectable } from "@angular/core";
import { HttpBackend, HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { catchError, filter, map, Observable, of, switchMap, take, tap, throwError } from "rxjs";
import {
    AuthConfig,
    AuthState,
    AuthStateStatus,
    PKCEChallenge,
    TokenResponse,
} from "@lib";
import { createPKCEChallenge, mapToType, mapToVoid, parseTokenPayload } from "@utils";
import { AUTH_CONFIG } from "@injectables";
import { AuthContext } from "@context";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    
    public static readonly PKCE_KEY = "scrum.auth.pkce_challenge";
    
    private http: HttpClient;
    
    constructor(@Inject(AUTH_CONFIG) private authConfig: AuthConfig,
                private auth: AuthContext,
                httpBackend: HttpBackend,
                private router: Router) {
        this.http = new HttpClient(httpBackend);
    }
    
    public onNoSessionError(): void {
        this.auth.onNoSession();
    }
    
    public initialize(): Observable<void> {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get("code");
        const error = queryParams.get("error");
        
        if (code !== null) {
            return this.exchangeAuthorizationCode(code).pipe(
                mapToVoid(),
                tap(() => {
                    this.router.navigate([window.location.pathname], { queryParams: {} });
                }),
                catchError((err) => {
                    console.error("Error exchanging authorization code!", err);
                    return of(void 0);
                }),
            );
        } else if (error !== null) {
            if (error === "login_required") {
                this.onNoSessionError();
                this.router.navigate([window.location.pathname], { queryParams: {} });
            } else {
                console.error("Unknown authentication error with code: " + error);
            }
        } else {
            this.silentLogin();
        }
        return of(void 0);
    }
    
    public silentLogin() {
        this.auth.getAuthState().pipe(
            filter((state: AuthState) => {
                return state.status === AuthStateStatus.NO_TOKENS;
            }),
            switchMap(() => {
                return createPKCEChallenge(PKCEChallenge.PKCEMethod.S256);
            }),
            take(1)
        ).subscribe({
            next: (request: PKCEChallenge) => {
                const { code_challenge_method, code_verifier, code_challenge } = request;
                localStorage.setItem(AuthService.PKCE_KEY, code_verifier);
                window.location.href = this.buildQueryUrl(this.authConfig.authorizationUrl, {
                    prompt: "none",
                    redirect_uri: window.location.origin + window.location.pathname,
                    code_challenge: code_challenge,
                    code_challenge_method: code_challenge_method
                });
            },
        });
    }
    
    public login() {
        createPKCEChallenge(PKCEChallenge.PKCEMethod.S256).pipe(
            take(1)
        ).subscribe({
            next: request => {
                const { code_challenge_method, code_challenge, code_verifier } = request;
                localStorage.setItem(AuthService.PKCE_KEY, code_verifier);
                
                window.location.href = this.buildQueryUrl(this.authConfig.authorizationUrl, {
                    redirect_uri: window.location.origin + window.location.pathname,
                    code_challenge: code_challenge,
                    code_challenge_method: code_challenge_method
                });
            },
        });
    }
    
    public logout(): void {
        this.auth.onLogout();
        window.location.href = this.authConfig.endSessionUrl +
            "?post_logout_redirect_uri=" + window.location.origin + window.location.pathname;
    }
    
    public silentLogout(): void {
        this.auth.onLogout();
        this.http.post(this.authConfig.endSessionUrl, null, { withCredentials: true }).pipe(
            take(1),
        ).subscribe(() => {
        
        });
    }
    
    public getAuthState(): Observable<AuthState> {
        return this.auth.getAuthState();
    }
    
    public exchangeAuthorizationCode(code: string): Observable<TokenResponse> {
        const url = this.authConfig.tokenUrl;
        const formData = new URLSearchParams();
        formData.set("code", code);
        formData.set("grant_type", "authorization_code");
        
        const verifier = localStorage.getItem(AuthService.PKCE_KEY);
        localStorage.removeItem(AuthService.PKCE_KEY);
        if (verifier === null) {
            throw new Error("No PKCE challenge! Code cannot be exchanged!");
        }
        formData.set("code_verifier", verifier);
        
        return this.http.post(url, formData, {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "accept": "application/json"
            }
        }).pipe(
            mapToType<TokenResponse>(),
            tap((tokens: TokenResponse) => {
                this.auth.onAuthentication(tokens);
            })
        );
    }
    
    public refreshTokens(): Observable<void> {
        return this.refreshToken().pipe(
            mapToVoid(),
        );
    }
    
    public getAccessToken(): Observable<string | null> {
        return this.auth.getAuthState().pipe(
            switchMap((state: AuthState) => {
                if (state.status === AuthStateStatus.AUTHENTICATED) {
                    const now = new Date();
                    const expiresAt = state.parsedAccessToken.expiresAt;
                    
                    const timeUntilExpiry = expiresAt.getTime() - now.getTime();
                    if (timeUntilExpiry <= this.authConfig.refreshTokenSecondsBefore) {
                        // token is about to expire
                        const refreshTokenPayload = parseTokenPayload(state.refreshToken);
                        const timeUntilRefreshExpiry = refreshTokenPayload.expiresAt.getTime() - now.getTime();
                        if (timeUntilRefreshExpiry > this.authConfig.refreshTokenSecondsBefore) {
                            // Refresh token is still valid, update tokens
                            return this.refreshToken().pipe(
                                map((tokens: TokenResponse) => {
                                    return tokens.access_token;
                                })
                            );
                        } else {
                            // Refresh token is also expired, login required
                            return throwError(() => new Error("Tokens expired, relogin required"));
                        }
                    }
                    // Token is still valid
                    return of(state.accessToken);
                }
                return throwError(() => new Error("Unauthenticated!"));
            })
        );
    }
    
    public refreshToken(): Observable<TokenResponse> {
        return this.auth.getRefreshToken().pipe(
            switchMap((refreshToken: string | null) => {
                if (refreshToken === null) {
                    return throwError(() => new Error("No refresh token!"));
                }
                
                const url = this.authConfig.tokenUrl;
                const formData = new URLSearchParams();
                formData.set("refresh_token", refreshToken);
                formData.set("grant_type", "refresh_token");
                
                return this.http.post(url, formData, {
                    headers: {
                        "content-type": "application/x-www-form-urlencoded",
                        "accept": "application/json"
                    }
                })
            }),
            map(res => res as TokenResponse),
            tap((tokens: TokenResponse) => {
                this.auth.onTokenRefresh(tokens);
            })
        );
    }
    
    private buildQueryUrl(url: string, params: { [key: string]: string }): string {
        const urlObj = new URL(url);
        Object.keys(params).forEach(param => {
            urlObj.searchParams.append(param, params[param]);
        });
        return urlObj.toString();
    }
    
}

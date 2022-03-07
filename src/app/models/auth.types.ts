export enum AuthStateStatus {
    AUTHENTICATED,
    NO_TOKENS,
    NO_SESSION,
}

export interface TokenInfo {
    subject: string;
    username: string;
    name: string;
    expiresAt: Date;
    email: string;
    sessionState: string;
}

type AuthenticatedState = {
    status: AuthStateStatus.AUTHENTICATED;
    accessToken: string;
    refreshToken: string;
    idToken: string;
    parsedAccessToken: TokenInfo;
    sessionState: string;
}

export type AuthState =
    | { status: AuthStateStatus.NO_SESSION }
    | { status: AuthStateStatus.NO_TOKENS }
    | AuthenticatedState;

export interface AuthConfig {
    issuer: string;
    authorizationUrl: string;
    tokenUrl: string;
    sessionIframeUrl: string;
    refreshTokenSecondsBefore: number;
    checkSessionEverySeconds: number;
}

export interface AppEnvironment {
    production: boolean;
    service: {
        apiUrl: string;
        authUrl: string;
        wsUrl: string;
    };
    options?: {
        refreshTokenSecondsBefore?: number;
        checkSessionEverySeconds?: number;
    };
}

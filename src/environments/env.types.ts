export interface AppEnvironment {
    production: boolean;
    service: {
        apiUrl: string;
        authUrl: string;
    };
    options?: {
        refreshTokenSecondsBefore?: number;
        checkSessionEverySeconds?: number;
    };
}

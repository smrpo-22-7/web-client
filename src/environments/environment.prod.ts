import { AppEnvironment } from "./env.types";

export const environment: AppEnvironment = {
    production: true,
    service: {
        apiUrl: "https://smrpo.mjamsek.com/v1",
        authUrl: "https://smrpo.mjamsek.com",
    }
};

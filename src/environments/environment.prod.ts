import { AppEnvironment } from "./env.types";

export const environment: AppEnvironment = {
    production: true,
    service: {
        apiUrl: "http://localhost:8080/v1",
        authUrl: "http://localhost:8080",
    }
};

import { Injectable } from "@angular/core";
import { PageError } from "@lib";
import { pageErrors } from "@config/error.config";

@Injectable({
    providedIn: "root"
})
export class ErrorService {
    
    public getError(status: string): PageError {
        const error = pageErrors.find(err => err.status === status);
        if (error) {
            return error;
        }
        throw new Error("Missing configuration for provided error!");
    }
    
}

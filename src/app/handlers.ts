import { ErrorHandler, Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class AppErrorHandler extends ErrorHandler {
    
    override handleError(error: any): void {
        // Error: Uncaught (in promise): ChunkLoadError: Loading chunk defau...ent_ts failed.
        if (error && error.message) {
            const errorMessage = error.message as string;
            if (errorMessage.includes("ChunkLoadError")) {
                return;
            }
        }
        super.handleError(error);
    }
}

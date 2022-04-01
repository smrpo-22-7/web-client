import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class ApiInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = req.headers;
        if (!headers.has("content-type")) {
            headers = headers.set("Content-Type", "application/json");
        } else {
            const contentType = headers.get("content-type");
            if (contentType === "xxxx") {
                headers = headers.delete("content-type")
            }
        }
        if (!headers.has("accept-language")) {
            headers = headers.set("Accept-Language", "en-US");
        }
        return next.handle(req.clone({
            headers
        }));
    }
}

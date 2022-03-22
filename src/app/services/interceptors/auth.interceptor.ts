import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, switchMap } from "rxjs";
import { AuthService } from "@services";

@Injectable({
    providedIn: "root"
})
export class AuthInterceptor implements HttpInterceptor {
    
    constructor(private authService: AuthService) {
    }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.getAccessToken().pipe(
            switchMap((accessToken: string | null) => {
                if (accessToken !== null) {
                    const headers = req.headers
                        .set("Authorization", `Bearer ${accessToken}`);
                    
                    return next.handle(req.clone({
                        headers
                    }));
                }
                return next.handle(req);
            })
        );
    }
}

import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable } from "rxjs";
import { AuthService } from "@services";
import { AuthState, AuthStateStatus } from "@lib";

@Injectable({
    providedIn: "root"
})
export class AdminGuard implements CanActivateChild {
    
    constructor(private auth: AuthService,
                private router: Router) {
    }
    
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.auth.getAuthState().pipe(
            map((state: AuthState) => {
                if (state.status === AuthStateStatus.AUTHENTICATED) {
                    if (state.roles.includes("admin")) {
                        return true;
                    }
                    this.router.navigate(["/error/403"]);
                    return false;
                } else {
                    this.router.navigate(["/"]);
                    return false;
                }
            })
        );
    }
    
}

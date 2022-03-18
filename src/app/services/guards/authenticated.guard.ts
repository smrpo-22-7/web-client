import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    Router,
    RouterStateSnapshot,
    UrlTree
} from "@angular/router";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AuthService } from "@services";
import { AuthState, AuthStateStatus } from "@lib";

@Injectable({
    providedIn: "root"
})
export class AuthenticatedGuard implements CanActivate {
    
    constructor(private auth: AuthService,
                private router: Router) {
    }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.auth.getAuthState().pipe(
            map((state: AuthState) => {
                if (state.status === AuthStateStatus.AUTHENTICATED) {
                    return true;
                } else {
                    this.router.navigate(["/"]);
                    return false;
                }
            })
        );
    }
}

@Injectable({
    providedIn: "root"
})
export class AuthenticatedChildGuard implements CanActivateChild {
    
    constructor(private auth: AuthService,
                private router: Router) {
    }
    
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.auth.getAuthState().pipe(
            map((state: AuthState) => {
                if (state.status === AuthStateStatus.AUTHENTICATED) {
                    return true;
                } else {
                    this.router.navigate(["/"]);
                    return false;
                }
            })
        );
    }
}

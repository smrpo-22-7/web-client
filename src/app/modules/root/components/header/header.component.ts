import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject, takeUntil } from "rxjs";
import { AuthService } from "@services";
import { AuthState, AuthStateStatus, NavState, NavStateStatus } from "@lib";
import { NavContext } from "@context";

@Component({
    selector: "sc-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
    
    public authStates = AuthStateStatus;
    public navStates = NavStateStatus;
    
    public auth$: Observable<AuthState>;
    public nav$: Observable<NavState>;
    private destroy$ = new Subject<boolean>();
    
    constructor(private nav: NavContext,
                private authService: AuthService) {
    }
    
    ngOnInit(): void {
        this.auth$ = this.authService.getAuthState().pipe(
            takeUntil(this.destroy$)
        );
        this.nav$ = this.nav.getNavState().pipe(
            takeUntil(this.destroy$)
        );
    }
    
    public login() {
        this.authService.login();
    }
    
    public logout() {
        this.authService.logout();
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
}

import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject, takeUntil } from "rxjs";
import { AuthService } from "@services";
import { AuthState, AuthStateStatus } from "@lib";

@Component({
    selector: "sc-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
    
    public authStates = AuthStateStatus;
    
    public auth$: Observable<AuthState>;
    private destroy$ = new Subject<boolean>();
    
    constructor(private authService: AuthService) {
    }
    
    ngOnInit(): void {
        this.auth$ = this.authService.getAuthState().pipe(
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

import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject, takeUntil } from "rxjs";
import { AuthState, AuthStateStatus } from "@lib";
import { AuthService } from "@services";

@Component({
    selector: "sc-anon-landing",
    templateUrl: "./anon-landing.component.html",
    styleUrls: ["./anon-landing.component.scss"]
})
export class AnonLandingComponent implements OnInit, OnDestroy {
    
    public auth$: Observable<AuthState>;
    private destroy$ = new Subject<boolean>();
    
    public authStates = AuthStateStatus;
    
    constructor(private auth: AuthService) {
    }
    
    ngOnInit(): void {
        this.auth$ = this.auth.getAuthState().pipe(
            takeUntil(this.destroy$),
        );
    }
    
    public login() {
        this.auth.login();
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
}

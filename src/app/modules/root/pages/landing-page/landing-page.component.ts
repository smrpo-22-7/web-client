import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "@services";
import { Observable, Subject, takeUntil } from "rxjs";
import { AuthState, AuthStateStatus } from "@lib";

@Component({
    selector: "sc-landing-page",
    templateUrl: "./landing-page.component.html",
    styleUrls: ["./landing-page.component.scss"]
})
export class LandingPageComponent implements OnInit, OnDestroy {
    
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
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
}

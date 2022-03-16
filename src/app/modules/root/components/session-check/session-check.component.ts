import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    Inject,
    OnDestroy,
    OnInit, SecurityContext,
    ViewChild
} from "@angular/core";
import { Subject, switchMap, takeUntil, timer } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";
import { AuthService } from "@services";
import { AUTH_CONFIG } from "@injectables";
import { AuthConfig, AuthStateStatus } from "@lib";

type SessionCheckStatus = "unchanged" | "changed" | "error";

@Component({
    selector: "sc-session-check",
    styles: [
        `iframe {
            display: none
        }`
    ],
    template: `
        <iframe #checkSSOIframe id="auth-sso-iframe"></iframe>
    `
})
export class SessionCheckComponent implements OnInit, AfterViewInit, OnDestroy {
    
    @ViewChild("checkSSOIframe", { static: false })
    private checkSSOContainer: ElementRef<HTMLIFrameElement>;
    
    private destroy$: Subject<boolean> = new Subject<boolean>();
    
    constructor(private sanitizer: DomSanitizer,
                private auth: AuthService,
                @Inject(AUTH_CONFIG) private authConfig: AuthConfig) {
    }
    
    ngOnInit(): void {
    
    }
    
    ngAfterViewInit() {
        this.checkSSOContainer.nativeElement.src = this.sanitizer.sanitize(SecurityContext.URL, this.authConfig.sessionIframeUrl)!;
        
        timer(0, this.authConfig.checkSessionEverySeconds * 1000).pipe(
            switchMap(() => this.auth.getAuthState()),
            takeUntil(this.destroy$)
        ).subscribe((auth) => {
            if (auth.status === AuthStateStatus.AUTHENTICATED) {
                this.checkSession(this.authConfig.issuer, auth.sessionState);
            } else {
                this.checkSession(this.authConfig.issuer);
            }
        });
    }
    
    private checkSession(providerOrigin: string, sessionState?: string): void {
        const message = `scrum-client ${sessionState || ""}`;
        const ssoWindow = this.checkSSOContainer.nativeElement.contentWindow;
        if (ssoWindow !== null) {
            try {
                ssoWindow.postMessage(message, providerOrigin);
            } catch (ignored) {
            
            }
        } else {
            console.warn("Unable to instantiate SSO iFrame window!");
        }
    }
    
    @HostListener("window:message", ["$event"])
    private onIframeMessage($event: MessageEvent): void {
        // Accept only issuer origin
        if ($event.origin !== this.authConfig.issuer) {
            return;
        }
        
        // Accept only string data
        if (typeof $event.data !== "string") {
            return;
        }
        
        const status: SessionCheckStatus = $event.data as SessionCheckStatus;
        if (status === "changed") {
            console.log("session status changed! Need to reauthenticate");
            // this.auth.silentLogin();
        } else if (status === "unchanged") {
            console.log("session status: ", status);
        } else {
            console.warn("Unable to retrieve session information!");
        }
        
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
}

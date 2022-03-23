import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject, takeUntil } from "rxjs";
import { FormBuilder, FormControl } from "@angular/forms";
import { AuthState, AuthStateStatus, NavState, NavStateStatus, Project } from "@lib";
import { NavContext } from "@context";
import { AuthService, ProjectService } from "@services";
import { EntityList } from "@mjamsek/prog-utils";
import { Router } from "@angular/router";

@Component({
    selector: "sc-project-picker",
    templateUrl: "./project-picker.component.html",
    styleUrls: ["./project-picker.component.scss"]
})
export class ProjectPickerComponent implements OnInit, OnDestroy {
    
    public projects$: Observable<EntityList<Project>>;
    public auth$: Observable<AuthState>;
    public nav$: Observable<NavState>;
    private destroy$ = new Subject<boolean>();
    
    public projectCtrl: FormControl;
    public authStates = AuthStateStatus;
    public navStates = NavStateStatus;
    
    constructor(private fb: FormBuilder,
                private router: Router,
                private projectService: ProjectService,
                private authService: AuthService,
                private nav: NavContext) {
    }
    
    ngOnInit(): void {
        this.auth$ = this.authService.getAuthState().pipe(
            takeUntil(this.destroy$)
        );
        this.nav$ = this.nav.getNavState().pipe(
            takeUntil(this.destroy$)
        );
        this.projects$ = this.projectService.getUserProjects().pipe(
            takeUntil(this.destroy$),
        );
        
        this.projectCtrl = this.fb.control(null);
        
        this.nav.getNavState().pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (state: NavState) => {
                if (state.status === NavStateStatus.IN_CONTEXT) {
                    this.projectCtrl.setValue(state.projectId, { emitEvent: false });
                }
            }
        });
        
        this.projectCtrl.valueChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (projectId: string) => {
                this.nav.setContext(projectId);
                this.router.navigateByUrl(this.replaceIdInPath(projectId, this.router.url));
            },
        });
    }
    
    ngOnDestroy(): void {
        this.destroy$.next(true);
    }
    
    private replaceIdInPath(newId: string, url: string): string {
        if (url.endsWith("/")) {
            url = url.substring(0, url.length - 1);
        }
        const PROJECT_PREFIX = "/projects";
        if (url.startsWith(PROJECT_PREFIX)) {
            url = url.replace(PROJECT_PREFIX, "");
            if (url === "") {
                return PROJECT_PREFIX;
            }
            if (url.startsWith("/")) {
                url = url.substring(1);
            }
            const slashIndex = url.indexOf("/");
            if (slashIndex >= 0) {
                return PROJECT_PREFIX + "/" + newId + url.substring(slashIndex);
            } else {
                return PROJECT_PREFIX + "/" + newId;
            }
        }
        return url;
    }
    
}

import { Component, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from "rxjs";
import { AuthState, AuthStateStatus, Project } from "@lib";
import { AuthService, ProjectService } from "@services";
import { EntityList } from "@mjamsek/prog-utils";
import { NavContext } from "@context";

@Component({
  selector: 'sc-user-landing',
  templateUrl: './user-landing.component.html',
  styleUrls: ['./user-landing.component.scss']
})
export class UserLandingComponent implements OnInit {
    
    public auth$: Observable<AuthState>;
    public projects$: Observable<EntityList<Project>>;
    private destroy$ = new Subject<boolean>();
    
    public authStates = AuthStateStatus;
    
    constructor(private auth: AuthService,
                private nav: NavContext,
                private projectService: ProjectService) {
    }
    
    ngOnInit(): void {
        this.auth$ = this.auth.getAuthState().pipe(
            takeUntil(this.destroy$),
        );
        this.projects$ = this.projectService.getUserProjects().pipe(
            takeUntil(this.destroy$),
        );
    }
    
    public changeContext(projectId: string) {
        this.nav.setContext(projectId);
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }

}

import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take, tap } from "rxjs";
import { NavState, NavStateStatus, ProjectRole } from "@lib";
import { ProjectService } from "@services";
import { mapToVoid } from "@utils";


@Injectable({
    providedIn: "root"
})
export class NavContext {
    
    private static readonly STORAGE_KEY = "scrum.nav.project"
    
    private context$ = new BehaviorSubject<NavState>({
        status: NavStateStatus.NO_CONTEXT,
    });
    
    constructor(private projectService: ProjectService) {
    }
    
    public initializeContext(): Observable<void> {
        return new Observable<void>(observer => {
            const storedItem = localStorage.getItem(NavContext.STORAGE_KEY);
            if (storedItem) {
                this.setContext(storedItem);
            }
            observer.next();
        });
    }
    
    public setContext(projectId: string): void {
        this.projectService.getUserRole(projectId).pipe(
            tap((role: ProjectRole) => {
                localStorage.setItem(NavContext.STORAGE_KEY, projectId);
                this.context$.next({
                    status: NavStateStatus.IN_CONTEXT,
                    projectId,
                    projectRole: role,
                });
            }),
            mapToVoid(),
            take(1),
        ).subscribe({
            next: () => {
            
            },
            error: err => {
                console.error(err);
            },
        });
    }
    
    public clearContext(): void {
        localStorage.removeItem(NavContext.STORAGE_KEY);
        this.context$.next({
            status: NavStateStatus.NO_CONTEXT,
        });
    }
    
    public getNavState(): Observable<NavState> {
        return this.context$.asObservable();
    }
    
}

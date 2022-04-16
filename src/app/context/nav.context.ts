import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Observable, of, switchMap, take, tap, throwError } from "rxjs";
import { AuthStateStatus, ForbiddenError, NavState, NavStateStatus, NotFoundError, ProjectRole } from "@lib";
import { AuthService, ProjectService } from "@services";
import { mapToVoid } from "@utils";


@Injectable({
    providedIn: "root"
})
export class NavContext {
    
    private static readonly STORAGE_KEY = "scrum.nav.project"
    
    private context$ = new BehaviorSubject<NavState>({
        status: NavStateStatus.NO_CONTEXT,
    });
    
    constructor(private projectService: ProjectService,
                private auth: AuthService) {
    }
    
    public initializeContext(): void {
        this.auth.getAuthState().pipe(
            switchMap(state => {
                if (state.status === AuthStateStatus.AUTHENTICATED) {
                    return this.init();
                }
                return of(undefined);
            }),
        ).subscribe({
            next: () => {
            
            }
        });
    }
    
    private init(): Observable<void> {
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
            catchError(err => {
                if (err instanceof ForbiddenError || err instanceof NotFoundError) {
                    localStorage.removeItem(NavContext.STORAGE_KEY);
                    this.context$.next({
                        status: NavStateStatus.NO_CONTEXT,
                    })
                    return of(undefined);
                }
                return throwError(() => err);
            }),
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

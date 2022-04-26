import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, filter, Observable, of, switchMap, take, tap, throwError } from "rxjs";
import { AuthStateStatus, ForbiddenError, NavState, NavStateStatus, NotFoundError, ProjectRole } from "@lib";
import { AuthService, ProjectService } from "@services";
import { mapToVoid } from "@utils";


@Injectable({
    providedIn: "root"
})
export class NavContext {
    
    private static readonly STORAGE_KEY = "scrum.nav.project";
    
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
        this.fetchContext(projectId).pipe(
            take(1),
        ).subscribe({
            next: () => {
            },
            error: err => {
                console.error(err);
            },
        });
    }
    
    private fetchContext(projectId: string): Observable<void> {
        return this.projectService.getUserRole(projectId).pipe(
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
        );
    }
    
    public updateContext(): void {
        this.context$.pipe(
            filter((context: NavState) => {
                return context.status === NavStateStatus.IN_CONTEXT;
            }),
            switchMap((context: NavState) => {
                if (context.status === NavStateStatus.IN_CONTEXT) {
                    return this.fetchContext(context.projectId);
                }
                throw Error("Invalid state!");
            }),
            take(1),
        ).subscribe(() => {});
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

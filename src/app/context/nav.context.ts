import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { NavState, NavStateStatus } from "@lib";


@Injectable({
    providedIn: "root"
})
export class NavContext {
    
    private static readonly STORAGE_KEY = "scrum.nav.project"
    
    private context$ = new BehaviorSubject<NavState>({
        status: NavStateStatus.NO_CONTEXT,
    });
    
    constructor() {
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
        localStorage.setItem(NavContext.STORAGE_KEY, projectId);
        this.context$.next({
            status: NavStateStatus.IN_CONTEXT,
            projectId,
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

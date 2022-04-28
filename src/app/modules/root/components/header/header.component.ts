import { Component, OnDestroy, OnInit } from "@angular/core";
import { filter, map, merge, Observable, of, Subject, switchMap, take, takeUntil, timer } from "rxjs";
import { AuthService, SocketService, TaskService } from "@services";
import { AuthState, AuthStateStatus, NavState, NavStateStatus, SocketMessage, TaskHour } from "@lib";
import { NavContext } from "@context";

type TaskTimer = {
    diff: number;
    startDate: Date;
    task: string;
    story: number;
}

@Component({
    selector: "sc-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
    
    public authStates = AuthStateStatus;
    public navStates = NavStateStatus;
    
    public auth$: Observable<AuthState>;
    public timer$: Observable<TaskTimer | undefined>;
    public nav$: Observable<NavState>;
    private destroy$ = new Subject<boolean>();
    private projectId$: Observable<string>;
    
    constructor(private nav: NavContext,
                private authService: AuthService,
                private socketService: SocketService,
                private taskService: TaskService) {
    }
    
    ngOnInit(): void {
        this.auth$ = this.authService.getAuthState().pipe(
            takeUntil(this.destroy$)
        );
        this.nav$ = this.nav.getNavState().pipe(
            takeUntil(this.destroy$)
        );
        
        this.projectId$ = this.nav$.pipe(
            filter((nav: NavState) => nav.status === NavStateStatus.IN_CONTEXT),
            map((nav: NavState) => {
                if (nav.status === NavStateStatus.IN_CONTEXT) {
                    return nav.projectId;
                }
                throw new Error("Invalid state!");
            }),
        );
        
        this.registerTimer();
    }
    
    private registerTimer() {
        const task$: Observable<TaskTimer | undefined> = this.projectId$.pipe(
            switchMap((projectId: string) => {
                return this.taskService.getActiveTask(projectId).pipe(
                    map((task: TaskHour | null) => {
                        if (task !== null) {
                            return {
                                startDate: new Date(task!.startDate),
                                diff: 0,
                                task: task?.taskName,
                                story: task?.storyNumberId,
                            };
                        }
                        return undefined;
                    }),
                );
            }),
        );
        
        this.timer$ = merge(
            task$,
            this.socketService.listen().pipe(
                filter((message: SocketMessage) => {
                    return message.type === "TIMER_START" || message.type === "TIMER_END";
                }),
                switchMap((message: SocketMessage) => {
                    if (message.type === "TIMER_START") {
                        return task$;
                    }
                    return of(undefined);
                }),
            ),
        ).pipe(
            switchMap((timerData: TaskTimer | undefined) => {
                return timer(0, 1000).pipe(
                    map(() => {
                        if (timerData) {
                            return {
                                ...timerData,
                                diff: new Date().getTime() - timerData.startDate.getTime(),
                            };
                        }
                        return undefined;
                    }),
                );
            }),
            takeUntil(this.destroy$),
        );
    }
    
    public stopWorkingOnTask() {
        this.projectId$.pipe(
            switchMap((projectId: string) => {
                return this.taskService.stopWorkingOnTask(projectId);
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

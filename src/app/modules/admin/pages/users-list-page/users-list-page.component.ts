import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable, Subject, switchMap, takeUntil } from "rxjs";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { EntityList } from "@mjamsek/prog-utils";
import { NavState, NavStateStatus, SimpleStatus, StoriesFilter, Story, User } from "@lib";
import { ProjectRole } from "@config/roles.config";
import { UserService } from "@services";

@Component({
    selector: "sc-users-list-page",
    templateUrl: "./users-list-page.component.html",
    styleUrls: ["./users-list-page.component.scss"]
})
export class UsersListPageComponent implements OnInit, OnDestroy {
    
    private destroy$ = new Subject<boolean>();
    public users$: Observable<EntityList<User>>;
    public limit$ = new BehaviorSubject<number>(10);
    public offset$ = new BehaviorSubject<number>(0);
    public filter$ = new BehaviorSubject<SimpleStatus>(SimpleStatus.ACTIVE);
    
    public statuses = SimpleStatus;
    
    constructor(private userService: UserService) {
    }
    
    ngOnInit(): void {
        this.users$ = combineLatest([this.filter$, this.offset$, this.limit$]).pipe(
            switchMap((params: [SimpleStatus, number, number]) => {
                const [status, offset, limit] = params;
                return this.userService.getUsers(status, offset, limit);
            }),
            takeUntil(this.destroy$)
        );
    }
    
    public newPage($event: PageChangedEvent): void {
        this.offset$.next(($event.page - 1) * $event.itemsPerPage);
    }
    
    public applyFilter(status: SimpleStatus): void {
        this.filter$.next(status);
        this.offset$.next(0);
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
}

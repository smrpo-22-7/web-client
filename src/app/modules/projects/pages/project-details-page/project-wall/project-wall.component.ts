import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable, Subject, switchMap, takeUntil } from "rxjs";
import { ProjectService, ProjectWallService } from "@services";
import { EntityList } from "@mjamsek/prog-utils";
import { ProjectWallPost } from "@lib";
import { PageChangedEvent } from "ngx-bootstrap/pagination";

type SortOrder = "ASC" | "DESC";

@Component({
    selector: "sc-project-wall",
    templateUrl: "./project-wall.component.html",
    styleUrls: ["./project-wall.component.scss"]
})
export class ProjectWallComponent implements OnInit, OnDestroy {
    
    @Input()
    public projectId$: Observable<string>;
    
    public posts$: Observable<EntityList<ProjectWallPost>>;
    public limit$ = new BehaviorSubject<number>(10);
    public offset$ = new BehaviorSubject<number>(0);
    public refresh$ = new BehaviorSubject<void>(undefined);
    public sort$ = new BehaviorSubject<SortOrder>("ASC");
    private destroy$ = new Subject<boolean>();
    
    public showForm: boolean = false;
    public showDetails: boolean = false;
    public selectedPostId: string | null = null;
    
    constructor(private projectService: ProjectService,
                private projectWallService: ProjectWallService) {
    }
    
    ngOnInit(): void {
        this.posts$ = combineLatest([this.projectId$, this.offset$, this.limit$, this.sort$, this.refresh$]).pipe(
            switchMap((routeParams: [string, number, number, SortOrder, void]) => {
                const [projectId, offset, limit, order] = routeParams;
                return this.projectWallService.getProjectWallPosts(projectId, offset, limit, order);
            }),
            takeUntil(this.destroy$)
        );
    }
    
    public toggleForm() {
        this.showForm = true;
    }
    
    public toggleDetails(post: ProjectWallPost): void {
        this.selectedPostId = post.id;
        this.showDetails = true;
    }
    
    public newPage($event: PageChangedEvent): void {
        this.offset$.next(($event.page - 1) * $event.itemsPerPage);
    }
    
    public onPostCreated() {
        this.showForm = false;
        this.refresh$.next();
    }
    
    public onPostCancel() {
        this.showForm = false;
    }
    
    public onDetailsClose() {
        this.showDetails = false;
    }
    
    public setOrder(order: SortOrder) {
        this.sort$.next(order);
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
}

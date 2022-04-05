import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable, Subject, switchMap, takeUntil } from "rxjs";
import { ProjectService } from "@services";
import { EntityList } from "@mjamsek/prog-utils";
import { ProjectWallPost } from "@lib";
import { PageChangedEvent } from "ngx-bootstrap/pagination";

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
    private destroy$ = new Subject<boolean>();
    
    public showForm: boolean = false;
    
    constructor(private projectService: ProjectService) {
    }
    
    ngOnInit(): void {
        this.posts$ = combineLatest([this.projectId$, this.offset$, this.limit$, this.refresh$]).pipe(
            switchMap((routeParams: [string, number, number, void]) => {
                const [projectId, offset, limit] = routeParams;
                return this.projectService.getProjectWallPosts(projectId, offset, limit);
            }),
            takeUntil(this.destroy$)
        );
    }
    
    public toggleForm() {
        this.showForm = true;
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
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
}

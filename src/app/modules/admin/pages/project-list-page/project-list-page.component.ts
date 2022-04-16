import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable, Subject, switchMap, take, takeUntil } from "rxjs";
import { EntityList } from "@mjamsek/prog-utils";
import { Project, SimpleStatus } from "@lib";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { ModalService, ProjectService } from "@services";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "sc-project-list-page",
    templateUrl: "./project-list-page.component.html",
    styleUrls: ["./project-list-page.component.scss"]
})
export class ProjectListPageComponent implements OnInit, OnDestroy {
    
    private destroy$ = new Subject<boolean>();
    public projects$: Observable<EntityList<Project>>;
    public limit$ = new BehaviorSubject<number>(10);
    public offset$ = new BehaviorSubject<number>(0);
    public filter$ = new BehaviorSubject<SimpleStatus>(SimpleStatus.ACTIVE);
    public refresh$ = new BehaviorSubject<void>(undefined);
    
    public statuses = SimpleStatus;
    
    constructor(private projectService: ProjectService,
                private modalService: ModalService,
                private toastrService: ToastrService) {
    }
    
    ngOnInit(): void {
        this.projects$ = combineLatest([this.filter$, this.offset$, this.limit$, this.refresh$]).pipe(
            switchMap((params: [SimpleStatus, number, number, void]) => {
                const [status, offset, limit] = params;
                return this.projectService.getProjects(status, offset, limit);
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
    
    public openDeletePrompt(project: Project) {
        const message = `Are you sure you want to remove project '${project.name}'?`;
        this.modalService.openConfirmDialog("Are you sure?", message, {
            onConfirm: ref => {
                this.projectService.removeProject(project.id).pipe(take(1)).subscribe({
                    next: () => {
                        this.refresh$.next();
                        this.toastrService.success("Project removed!", "Success!");
                    },
                    error: () => {
                        this.toastrService.error("Error removing project!", "Error!");
                    },
                    complete: () => {
                        ref.hide();
                    },
                });
            }
        }, {
            confirm: {
                clazz: "btn-danger",
            },
            decline: {
                clazz: "btn-outline-secondary",
            }
        });
    }
    
    public openActivatePrompt(project: Project) {
        const message = `Are you sure you want to reactivate project '${project.name}'?`;
        this.modalService.openConfirmDialog("Are you sure?", message, {
            onConfirm: ref => {
                this.projectService.activateProject(project.id).pipe(take(1)).subscribe({
                    next: () => {
                        this.refresh$.next();
                        this.toastrService.success("Project reactivated!", "Success!");
                    },
                    error: () => {
                        this.toastrService.error("Error reactivating project!", "Error!");
                    },
                    complete: () => {
                        ref.hide();
                    },
                });
            }
        }, {
            confirm: {
                clazz: "btn-primary",
            },
            decline: {
                clazz: "btn-outline-danger",
            }
        });
    }
    
}

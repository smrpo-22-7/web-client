import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { SprintService, ModalService } from "@services";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { map, Observable, startWith, Subject, switchMap, takeUntil, take } from "rxjs";
import { NavState, NavStateStatus, SprintListResponse, Sprint } from "@lib";
import { ProjectRole } from "@config/roles.config";
import { NavContext } from "@context";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "sc-project-sprints-list-page",
    templateUrl: "./project-sprints-list-page.component.html",
    styleUrls: ["./project-sprints-list-page.component.scss"]
})
export class ProjectSprintsListPageComponent implements OnInit, OnDestroy {

    @Output()
    public whenUpdated = new EventEmitter<void>();


    public sprints$: Observable<SprintListResponse>;
    public nav$: Observable<NavState>;
    private destroy$ = new Subject<boolean>();
    
    public navStates = NavStateStatus;
    public projectRoles = ProjectRole;
    
    constructor(private sprintService: SprintService,
                private modalService: ModalService,
                private toastrService: ToastrService,
                private nav: NavContext,
                private route: ActivatedRoute) {
    }
    
    ngOnInit(): void {
        this.sprints$ = this.route.paramMap.pipe(
            startWith(this.route.snapshot.paramMap),
            map((paramMap: ParamMap) => {
                return paramMap.get("projectId") as string;
            }),
            switchMap((projectId: string) => {
                return this.sprintService.getProjectSprints(projectId, true, true, true);
            }),
            takeUntil(this.destroy$),
        );
        this.nav$ = this.nav.getNavState().pipe(
            takeUntil(this.destroy$),
        );
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
        
    }

    public openDeletePrompt(sprint: Sprint) {
        const message = `Are you sure you want to remove sprint '${sprint.title}'?`;
        this.modalService.openConfirmDialog("Are you sure?", message, {
            onConfirm: ref => {
                this.sprintService.removeSprint(sprint.id).pipe(take(1)).subscribe({
                    next: () => {
                        this.whenUpdated.emit();
                        this.toastrService.success("Sprint removed!", "Success!");
                    },
                    error: () => {
                        this.toastrService.error("An error occurred removing the sprint!", "Error!");
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
}

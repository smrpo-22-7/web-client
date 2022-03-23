import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, map, Observable, startWith, Subject, switchMap, takeUntil } from "rxjs";
import { EntityList } from "@mjamsek/prog-utils";
import { Story } from "@lib";
import { ProjectService } from "@services";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";
import { AbstractControl, FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { PageChangedEvent } from "ngx-bootstrap/pagination";

@Component({
    selector: "sc-project-stories-page",
    templateUrl: "./project-stories-page.component.html",
    styleUrls: ["./project-stories-page.component.scss"]
})
export class ProjectStoriesPageComponent extends FormBaseComponent implements OnInit, OnDestroy {
    
    private destroy$ = new Subject<boolean>();
    public stories$: Observable<EntityList<Story>>;
    
    public limit$ = new BehaviorSubject<number>(10);
    public offset$ = new BehaviorSubject<number>(0);
    public totalPages = 0;
    private refresh$ = new BehaviorSubject<void>(undefined);
    
    public storiesForm: FormArray;
    
    constructor(private projectService: ProjectService,
                private route: ActivatedRoute,
                private fb: FormBuilder) {
        super();
    }
    
    ngOnInit(): void {
        this.storiesForm = this.fb.array([]);
        
        const routeParams$ = this.route.paramMap.pipe(
            startWith(this.route.snapshot.paramMap),
            map((paramMap: ParamMap) => {
                return paramMap.get("projectId")!;
            })
        );
    
        this.stories$ = combineLatest([routeParams$, this.offset$, this.limit$, this.refresh$]).pipe(
            switchMap((params: [string, number, number, void]) => {
                const [projectId, offset, limit] = params;
                return this.projectService.getProjectStories(projectId, offset, limit);
            }),
            takeUntil(this.destroy$)
        );
    }
    
    public onStorySelect($event: Event) {
        $event.stopPropagation();
        const checkboxElement = $event.target as HTMLInputElement;
        if (checkboxElement.checked) {
            this.storiesForm.push(this.fb.control(checkboxElement.value));
        } else {
            this.storiesForm.controls.forEach((ctrl: AbstractControl, i: number) => {
                if (ctrl.value === checkboxElement.value) {
                    this.storiesForm.removeAt(i);
                    return;
                }
            });
        }
    }
    
    public newPage($event: PageChangedEvent): void {
        this.offset$.next(($event.page - 1) * $event.itemsPerPage);
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
}

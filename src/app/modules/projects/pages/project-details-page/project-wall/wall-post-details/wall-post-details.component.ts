import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import { BehaviorSubject, combineLatest, Observable, Subject, switchMap, take, takeUntil } from "rxjs";
import { NavState, NavStateStatus, ProjectWallComment, ProjectWallPost, SortOrder } from "@lib";
import { EntityList } from "@mjamsek/prog-utils";
import { ModalService, ProjectWallService } from "@services";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import SimpleMDE from "simplemde";
import { ToastrService } from "ngx-toastr";
import { NavContext } from "@context";
import { ProjectRole } from "@config/roles.config";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";

@Component({
    selector: "sc-wall-post-details",
    templateUrl: "./wall-post-details.component.html",
    styleUrls: ["./wall-post-details.component.scss"],
    // encapsulation: ViewEncapsulation.None,
})
export class WallPostDetailsComponent extends FormBaseComponent implements OnInit, AfterViewInit, OnDestroy {
    
    @Input()
    public postId: string;
    
    @Output()
    public whenClosed = new EventEmitter<void>();
    
    @Output()
    public whenPostDeleted = new EventEmitter<void>();
    
    public post$: Observable<ProjectWallPost>;
    public comments$: Observable<EntityList<ProjectWallComment>>;
    public limit$ = new BehaviorSubject<number>(10);
    public offset$ = new BehaviorSubject<number>(0);
    public refresh$ = new BehaviorSubject<void>(undefined);
    public sort$ = new BehaviorSubject<SortOrder>("DESC");
    public nav$: Observable<NavState>;
    public navStates = NavStateStatus;
    public projectRoles = ProjectRole;
    private destroy$ = new Subject<boolean>();
    
    public commentForm: FormGroup;
    private editorRef: ElementRef<HTMLDivElement>;
    private editorInstance: SimpleMDE;
    
    constructor(private projectWallService: ProjectWallService,
                private toastrService: ToastrService,
                private modalService: ModalService,
                private nav: NavContext,
                private fb: FormBuilder) {
        super();
    }
    
    ngOnInit(): void {
        this.commentForm = this.fb.group({
            markdownContent: this.fb.control("", [Validators.required]),
        });
        this.nav$ = this.nav.getNavState().pipe(
            takeUntil(this.destroy$),
        );
        
        this.post$ = this.projectWallService.getPost(this.postId).pipe(
            takeUntil(this.destroy$),
        );
        this.comments$ = combineLatest([this.offset$, this.limit$, this.sort$, this.refresh$]).pipe(
            switchMap((routeParams: [number, number, SortOrder, void]) => {
                const [offset, limit, order] = routeParams;
                return this.projectWallService.getPostComments(this.postId, limit, offset, order);
            }),
            takeUntil(this.destroy$)
        );
    }
    
    ngAfterViewInit() {
        this.editorInstance = new SimpleMDE({ element: this.editorRef.nativeElement });
        this.editorInstance.codemirror.on("change", () => {
            this.markdownContentCtrl.setValue(this.editorInstance.value(), { emitEvent: false });
        });
    }
    
    public newPage($event: PageChangedEvent): void {
        this.offset$.next(($event.page - 1) * $event.itemsPerPage);
    }
    
    public setOrder(order: SortOrder) {
        this.sort$.next(order);
    }
    
    public addComment(): void {
        this.projectWallService.addPostComment(this.postId, {
            markdownContent: this.markdownContentCtrl.value,
        }).pipe(take(1)).subscribe({
            next: () => {
                this.toastrService.success("Added comment!", "Success!");
                this.refresh$.next();
                this.resetForm();
            },
            error: err => {
                console.error(err);
                this.toastrService.error("Error adding comment!", "Error!");
            }
        })
    }
    
    public openDeleteCommentDialog(comment: ProjectWallComment) {
        const message = `Are you sure you want to delete comment by ${comment.author.firstName} ${comment.author.lastName}?`;
        this.modalService.openConfirmDialog("Are you sure?", message, {
            onConfirm: ref => {
                this.projectWallService.removeComment(comment.id).pipe(take(1)).subscribe({
                    next: () => {
                        this.toastrService.warning("Comment removed!", "Success!");
                        this.refresh$.next();
                    },
                    error: err => {
                        console.error(err);
                        this.toastrService.error("Error removing comment!", "Error!");
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
                clazz: "btn-outline-primary",
            },
        });
    }
    
    public openDeletePostDialog(post: ProjectWallPost) {
        const message = `Are you sure you want to delete post by ${post.author.firstName} ${post.author.lastName}?`;
        this.modalService.openConfirmDialog("Are you sure?", message, {
            onConfirm: ref => {
                this.projectWallService.removePost(post.id).pipe(take(1)).subscribe({
                    next: () => {
                        this.toastrService.warning("Post removed!", "Success!");
                        this.whenPostDeleted.emit();
                    },
                    error: err => {
                        console.error(err);
                        this.toastrService.error("Error removing post!", "Error!");
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
                clazz: "btn-outline-primary",
            },
        });
    }
    
    public resetForm(): void {
        this.editorInstance.value("");
    }
    
    public closeDetails() {
        this.whenClosed.emit();
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
    
    public get markdownContentCtrl(): FormControl {
        return this.commentForm.controls["markdownContent"] as FormControl;
    }
    
    @ViewChild("mdEditor", { static: false })
    public set editorReference(content: ElementRef<HTMLDivElement>) {
        if (content) {
            this.editorRef = content;
        }
    }
}

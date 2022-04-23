import { Component, OnDestroy, OnInit } from "@angular/core";
import {BehaviorSubject, combineLatest, Observable, Subject, switchMap, take, takeUntil} from "rxjs";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { EntityList } from "@mjamsek/prog-utils";
import {NavState, NavStateStatus, Project, SimpleStatus, StoriesFilter, Story, User} from "@lib";
import { ProjectRole } from "@config/roles.config";
import {ModalService, UserService} from "@services";
import {ToastrService} from "ngx-toastr";
import {EditUserComponent} from "../edit-user/edit-user.component";
import {catchHttpError, mapToVoid} from "@utils";

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
    public refresh$ = new BehaviorSubject<void>(undefined);
    
    public statuses = SimpleStatus;
    
    constructor(private userService: UserService,
                private modalService: ModalService,
                private toastrService: ToastrService) {

    }
    
    ngOnInit(): void {
        this.users$ = combineLatest([this.filter$, this.offset$, this.limit$, this.refresh$]).pipe(
            switchMap((params: [SimpleStatus, number, number, void]) => {
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

    public openDeletePrompt(user: User) {
        const message = `Are you sure you want to remove user '${user.lastName} ${user.firstName}'?`;
        this.modalService.openConfirmDialog("Are you sure?", message, {
            onConfirm: ref => {
                this.userService.removeUser(user.id).pipe(take(1)).subscribe({
                    next: () => {
                        this.refresh$.next();
                        this.toastrService.success("User removed!", "Success!");
                    },
                    error: () => {
                        this.toastrService.error("Error removing user!", "Error!");
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

    public openEditPrompt(user: User) {
        const trenutniUser = { userId: user.id };
        this.modalService.openModal(EditUserComponent, {initialState: trenutniUser});

    }

    public openActivatePrompt(user: User) {
        const message = `Are you sure you want to reactivate user '${user.lastName} ${user.firstName}'?`;
        this.modalService.openConfirmDialog("Are you sure?", message, {
            onConfirm: ref => {
                this.userService.activateUser(user.id).pipe(take(1)).subscribe({
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

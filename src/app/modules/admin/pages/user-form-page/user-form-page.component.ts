import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Observable, Subject, takeUntil } from "rxjs";
import { SysRole } from "@lib";
import { RoleService } from "@services";

@Component({
    selector: "sc-user-form-page",
    templateUrl: "./user-form-page.component.html",
    styleUrls: ["./user-form-page.component.scss"]
})
export class UserFormPageComponent implements OnInit, OnDestroy {
    
    public roles$: Observable<SysRole[]>;
    public userForm: FormGroup;
    private destroy$ = new Subject<boolean>();
    
    constructor(private fb: FormBuilder,
                private roleService: RoleService) {
    }
    
    ngOnInit(): void {
        this.userForm = this.fb.group({
            username: this.fb.control(""),
            password: this.fb.control(""),
            confirmPassword: this.fb.control(""),
            firstName: this.fb.control(""),
            lastName: this.fb.control(""),
            email: this.fb.control(""),
            sysRoles: this.fb.array([]),
        });
        
        this.roles$ = this.roleService.getAllSysRoles().pipe(
            takeUntil(this.destroy$)
        );
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
    }
}

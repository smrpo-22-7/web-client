import { Component, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject, take, takeUntil } from "rxjs";
import { isUserRegisterRequest, ProjectRole, SysRole, PriorityType } from "@lib";
import { ProjectService, RoleService, UserService, StorypriorityService } from "@services";
import { validateUniqueUsername } from "@utils";
import { FormBaseComponent } from "@shared/components/form-base/form-base.component";
import { ToastrService } from "ngx-toastr";
import { validateUserForm, validateUserRoles } from "../../../admin/pages/user-form-page/validators";
import {validatePasswords} from "../../../user-profile/pages/user-profile-page/password.validators";
import { validateDates } from "./sprint.validators";


@Component({
    selector: "sc-sprint-form-page",
    templateUrl: "./sprint-form-page.component.html",
    styleUrls: ["./sprint-form-page.component.scss"]
})
export class SprintFormPageComponent extends FormBaseComponent implements OnInit{

    public sprintForm: FormGroup;

    constructor(private fb: FormBuilder,
                private toastrService: ToastrService) {
        super();
    }

    ngOnInit() {
        this.sprintForm = this.fb.group({
            startdate: this.fb.control(new Date().toISOString()),
            enddate: this.fb.control(new Date().toISOString()),
            velocity: this.fb.control(1)
        }, { validators: [validateDates] } );
    }
}

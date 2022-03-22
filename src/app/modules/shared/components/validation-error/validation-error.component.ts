import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Component({
    selector: "sc-validation-error",
    templateUrl: "./validation-error.component.html",
    styleUrls: ["./validation-error.component.scss"]
})
export class ValidationErrorComponent implements OnInit {
    
    @Input()
    public control: AbstractControl | null;
    
    @Input()
    public errorCode: string;
    
    constructor() {
    }
    
    ngOnInit(): void {
    
    }
    
    public get hasError(): boolean {
        if (this.control !== null) {
            return this.control.hasError(this.errorCode);
        }
        return false;
    }
    
}

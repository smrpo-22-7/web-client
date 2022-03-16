import { Directive, ElementRef, Input } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Directive({
    selector: "[hasErrored]"
})
export class HasErroredDirective {
    
    @Input("hasErrored")
    public formElement: AbstractControl;
    
    @Input("errorCode")
    public errorCode: string;
    
    constructor(element: ElementRef) {
        if (this.formElement.hasError(this.errorCode)) {
            element.nativeElement.classList.add("error");
        } else {
            element.nativeElement.classList.remove("error");
        }
    }
    
}

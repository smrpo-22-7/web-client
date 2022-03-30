import { Directive, Host } from "@angular/core";
import { NgForOf } from "@angular/common";
import { BaseType } from "@lib";

@Directive({
    selector: "[ngForTrackById]"
})
export class NgForTrackByIdDirective<T extends BaseType> {
    
    constructor(@Host() private ngFor: NgForOf<T>) {
        this.ngFor.ngForTrackBy = (_, item) => {
            return item.id;
        };
    }
    
}

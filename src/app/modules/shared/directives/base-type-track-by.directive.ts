import { Directive, Host, Input, NgIterable } from "@angular/core";
import { NgForOf } from "@angular/common";
import { BaseType } from "@lib";

@Directive({
    selector: "[ngForTrackById]"
})
export class NgForTrackByIdDirective<T extends BaseType> {
    
    @Input()
    ngForOf!: NgIterable<T>;
    
    constructor(@Host() private ngFor: NgForOf<T>) {
        this.ngFor.ngForTrackBy = (_, item: T) => {
            return item.id;
        };
    }
}

@Directive({
    selector: "[ngForTrackByProp]"
})
export class NgForTrackByPropDirective<T> {
    
    @Input()
    ngForOf!: NgIterable<T>;
    
    @Input()
    ngForTrackByProp!: keyof T;
    
    constructor(@Host() private ngFor: NgForOf<T>) {
        this.ngFor.ngForTrackBy = (_, item: T) => {
            return item[this.ngForTrackByProp];
        };
    }
}

import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { initialName } from "@utils";

@Component({
    selector: "sc-user-initials-icon",
    templateUrl: "./user-initials-icon.component.html",
    styleUrls: ["./user-initials-icon.component.scss"]
})
export class UserInitialsIconComponent implements OnInit {

    @Input("initials")
    public _initials: string;
    
    @Input("name")
    public _name: string;
    
    @Input()
    public disabled: boolean = false;
    
    @Input()
    public showTooltip: boolean = false;
    
    @Output()
    public whenClicked = new EventEmitter<void>();
    
    constructor() {
    }
    
    ngOnInit(): void {
    
    }
    
    public get name(): string {
        return this._name;
    }
    
    public get initials(): string {
        return this._initials || initialName(this._name);
    }
    
    public get isClickable(): boolean {
        return this.whenClicked.observed;
    }
}

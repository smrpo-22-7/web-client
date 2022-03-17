import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { TokenInfo } from "@lib";
import { BsDropdownDirective } from "ngx-bootstrap/dropdown";

@Component({
    selector: "sc-user-icon",
    templateUrl: "./user-icon.component.html",
    styleUrls: ["./user-icon.component.scss"]
})
export class UserIconComponent implements OnInit {
    
    @Output()
    public whenLogoutClicked = new EventEmitter<void>();
    
    @Input()
    public info: TokenInfo;
    
    @ViewChild("dropdown", {static: true})
    public dropdownRef: BsDropdownDirective;
    
    public initials: string = "U";
    
    constructor() {
    }
    
    ngOnInit(): void {
        this.initials = this.initialsFromName(this.info.name);
    }
    
    public logout() {
        this.dropdownRef.hide();
        this.whenLogoutClicked.next();
    }
    
    private initialsFromName(name: string): string {
        const nameParts = name.split(" ");
        if (nameParts.length >= 2) {
            return nameParts[0][0] + nameParts[1][0];
        }
        return name[0];
    }
    
}

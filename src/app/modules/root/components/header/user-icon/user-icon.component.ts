import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { TokenInfo } from "@lib";
import { BsDropdownDirective } from "ngx-bootstrap/dropdown";
import { initialName } from "@utils";
import { AuthService } from "@services";

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
    
    constructor(private auth: AuthService) {
    }
    
    ngOnInit(): void {
        this.initials = initialName(this.info.name);
    }
    
    public logout() {
        this.dropdownRef.hide();
        this.whenLogoutClicked.next();
    }
    
    public switchUser() {
        this.auth.silentLogout();
        this.auth.login();
    }
}

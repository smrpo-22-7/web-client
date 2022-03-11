import { Component, OnInit } from "@angular/core";
import { AuthService } from "@services";

@Component({
    selector: "sc-root",
    templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {

    constructor(private auth: AuthService) {
    }
    
    ngOnInit() {
        this.auth.handleAuthorizationCode();
    }
    
}

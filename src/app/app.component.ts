import { Component, OnInit } from "@angular/core";
import { SocketService } from "@services";
import { take } from "rxjs";
import { SocketMessage } from "@lib";

@Component({
    selector: "sc-root",
    templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {
    
    constructor(private socketService: SocketService) {
    }
    
    ngOnInit() {
        this.socketService.connect().pipe(take(1)).subscribe({
            next: () => {
                const message: SocketMessage = {
                    type: "REGISTER",
                };
                this.socketService.sendMessage(message);
            }
        });
    }
}

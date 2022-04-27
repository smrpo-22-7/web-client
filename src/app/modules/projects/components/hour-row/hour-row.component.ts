import { Component, Input, OnInit } from "@angular/core";
import { TaskWorkSpent } from "@lib";

@Component({
    selector: "sc-hour-row",
    templateUrl: "./hour-row.component.html",
    styleUrls: ["./hour-row.component.scss"],
})
export class HourRowComponent implements OnInit {

    @Input()
    public taskHour: TaskWorkSpent;
    
    constructor() {
    }
    
    ngOnInit(): void {
    }
    
}

import { Component, Input, OnInit } from "@angular/core";
import { Sprint } from "@lib";

@Component({
    selector: "sc-sprint-row",
    templateUrl: "./sprint-row.component.html",
    styleUrls: ["./sprint-row.component.scss"]
})
export class SprintRowComponent implements OnInit {

    @Input()
    public sprint: Sprint;
    
    constructor() {
    }
    
    ngOnInit(): void {
    }
    
}

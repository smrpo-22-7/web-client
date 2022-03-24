import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ConfirmDialogOptions } from "@lib";

@Component({
    selector: "sc-confirm-dialog",
    templateUrl: "./confirm-dialog.component.html",
    styleUrls: ["./confirm-dialog.component.scss"]
})
export class ConfirmDialogComponent implements OnInit {
    
    public title: string;
    public dialog: string;
    public buttonStyles = {
        confirm: "btn-primary",
        decline: "btn-outline-danger"
    };
    public options: ConfirmDialogOptions;
    
    public onConfirm = (ref: BsModalRef) => {
        ref.hide();
    }
    
    public onDecline = (ref: BsModalRef) => {
        ref.hide();
    }
    
    constructor(public modalRef: BsModalRef) {
    }
    
    ngOnInit(): void {
        if (this.options && this.options.confirm && this.options.confirm.clazz) {
            this.buttonStyles.confirm = this.options.confirm.clazz;
        }
        if (this.options && this.options.decline && this.options.decline.clazz) {
            this.buttonStyles.decline = this.options.decline.clazz;
        }
    }
    
    confirm() {
        this.onConfirm(this.modalRef);
    }
    
    decline() {
        this.onDecline(this.modalRef);
    }
    
}

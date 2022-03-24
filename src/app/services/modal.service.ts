import { Injectable } from "@angular/core";
import { BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ConfirmDialogEvents, ConfirmDialogOptions } from "@lib";
import { ConfirmDialogComponent } from "@shared/components/confirm-dialog/confirm-dialog.component";

@Injectable({
    providedIn: "root"
})
export class ModalService {
    
    constructor(private bsModalService: BsModalService) {
    }
    
    public openModal(modalComponent: any, config?: ModalOptions): void {
        this.bsModalService.show(modalComponent, config);
    }
    
    public openConfirmDialog(title: string, dialog: string, events?: ConfirmDialogEvents, options?: ConfirmDialogOptions): void {
        const initialState: any = {
            title,
            dialog,
        };
        if (events && events.onConfirm) {
            initialState.onConfirm = events.onConfirm;
        }
        if (events && events.onDecline) {
            initialState.onDecline = events.onDecline;
        }
        initialState.options = options;
        this.bsModalService.show(ConfirmDialogComponent, { initialState });
    }
    
}

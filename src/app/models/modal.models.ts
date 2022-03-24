import { BsModalRef } from "ngx-bootstrap/modal";

export interface ConfirmDialogEvents {
    onConfirm?: (ref: BsModalRef) => void;
    onDecline?: (ref: BsModalRef) => void;
}

export interface ConfirmDialogOptions {
    confirm?: {
        clazz?: string;
    };
    decline?: {
        clazz?: string;
    };
}

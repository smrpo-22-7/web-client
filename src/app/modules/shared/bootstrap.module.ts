import { NgModule } from "@angular/core";
import { AlertModule } from "ngx-bootstrap/alert";
import { ModalModule } from "ngx-bootstrap/modal";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { ToastrModule } from "ngx-toastr";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";

@NgModule({
    imports: [
        AlertModule.forRoot(),
        ModalModule.forRoot(),
        ToastrModule.forRoot({
            timeOut: 3000,
            closeButton: true,
            maxOpened: 3,
            newestOnTop: true,
            tapToDismiss: true,
            positionClass: "toast-bottom-right",
        }),
        PaginationModule.forRoot(),
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
    ],
    exports: [
        AlertModule,
        ModalModule,
        ToastrModule,
        PaginationModule,
        TooltipModule,
        BsDropdownModule,
    ]
})
export class BootstrapModule {

}

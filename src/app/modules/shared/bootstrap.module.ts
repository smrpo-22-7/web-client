import { NgModule } from "@angular/core";
import { AlertModule } from "ngx-bootstrap/alert";
import { ModalModule } from "ngx-bootstrap/modal";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { ToastrModule } from "ngx-toastr";

@NgModule({
    imports: [
        AlertModule.forRoot(),
        ModalModule.forRoot(),
        ToastrModule.forRoot(),
        PaginationModule.forRoot(),
    ],
    exports: [
        AlertModule,
        ModalModule,
        ToastrModule,
        PaginationModule,
    ]
})
export class BootstrapModule {

}

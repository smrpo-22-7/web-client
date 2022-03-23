import { NgModule } from "@angular/core";
import { AlertModule } from "ngx-bootstrap/alert";
import { ModalModule } from "ngx-bootstrap/modal";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { ToastrModule } from "ngx-toastr";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import { AccordionModule } from "ngx-bootstrap/accordion";

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
        TypeaheadModule.forRoot(),
        BsDatepickerModule.forRoot(),
        AccordionModule.forRoot(),
    ],
    exports: [
        AlertModule,
        ModalModule,
        ToastrModule,
        PaginationModule,
        TooltipModule,
        BsDropdownModule,
        TypeaheadModule,
        BsDatepickerModule,
        AccordionModule,
    ]
})
export class BootstrapModule {

}

import { NgModule } from "@angular/core";
import { ProjectEditFormPageComponent } from "./pages/project-edit-form-page/project-edit-form-page.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { ProjectAdminRoutingModule } from "./project-admin-routing.module";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ProjectAdminRoutingModule,
    ],
    declarations: [
        ProjectEditFormPageComponent
    ]
})
export class ProjectAdminModule {

}

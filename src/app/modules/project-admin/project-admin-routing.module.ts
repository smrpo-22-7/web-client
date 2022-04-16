import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ProjectEditFormPageComponent } from "./pages/project-edit-form-page/project-edit-form-page.component";

const routes: Routes = [
    { path: "edit", component: ProjectEditFormPageComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule,
    ]
})
export class ProjectAdminRoutingModule {

}

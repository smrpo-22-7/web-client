import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProjectsListPageComponent } from "./pages/projects-list-page/projects-list-page.component";
import { ProjectFormPageComponent } from "./pages/project-form-page/project-form-page.component";

const routes: Routes = [
    { path: "", pathMatch: "full", component: ProjectsListPageComponent },
    { path: ":id", component: ProjectFormPageComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule,
    ]
})
export class ProjectsRoutingModule {

}

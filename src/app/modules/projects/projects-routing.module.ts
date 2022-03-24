import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProjectsListPageComponent } from "./pages/projects-list-page/projects-list-page.component";
import { ProjectDetailsPageComponent } from "./pages/project-details-page/project-details-page.component";

const routes: Routes = [
    { path: "", pathMatch: "full", component: ProjectsListPageComponent },
    { path: ":projectId", component: ProjectDetailsPageComponent },
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

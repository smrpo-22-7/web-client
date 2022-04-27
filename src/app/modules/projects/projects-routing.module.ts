import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProjectDetailsPageComponent } from "./pages/project-details-page/project-details-page.component";
import { ProjectHoursPageComponent } from "./pages/project-hours-page/project-hours-page.component";

const routes: Routes = [
    { path: ":projectId", component: ProjectDetailsPageComponent },
    { path: ":projectId/hours", component: ProjectHoursPageComponent },
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

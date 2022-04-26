import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProjectSprintsListPageComponent } from "./pages/project-sprints-list-page/project-sprints-list-page.component";
import { SprintFormPageComponent } from "./pages/sprint-form-page/sprint-form-page.component";
import { SprintDetailsPageComponent } from "./pages/sprint-details-page/sprint-details-page.component";
import { SprintBacklogPageComponent } from "./pages/sprint-backlog-page/sprint-backlog-page.component";
import { EditSprintComponent } from "./pages/edit-sprint/edit-sprint.component";

const routes: Routes = [
    { path: "", pathMatch: "full", component: SprintBacklogPageComponent },
    { path: "all", component: ProjectSprintsListPageComponent },
    { path: "new", component: SprintFormPageComponent },
    { path: ":sprintId", component: SprintDetailsPageComponent },
    { path: ":sprintId/edit", component: EditSprintComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule,
    ]
})
export class SprintsRoutingModule {

}

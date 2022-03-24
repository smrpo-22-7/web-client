import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProjectSprintsListPageComponent } from "./pages/project-sprints-list-page/project-sprints-list-page.component";
import { SprintFormPageComponent } from "./pages/sprint-form-page/sprint-form-page.component";
import { SprintDetailsPageComponent } from "./pages/sprint-details-page/sprint-details-page.component";

const routes: Routes = [
    { path: "", pathMatch: "full", component: ProjectSprintsListPageComponent },
    { path: "new", component: SprintFormPageComponent },
    { path: ":sprintId", component: SprintDetailsPageComponent },
]

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

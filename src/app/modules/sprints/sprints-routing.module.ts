import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProjectSprintsListPageComponent } from "./pages/project-sprints-list-page/project-sprints-list-page.component";

const routes: Routes = [
    {path: "", pathMatch: "full", component: ProjectSprintsListPageComponent}
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

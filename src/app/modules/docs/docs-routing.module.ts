import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ProjectDocsDetailsPageComponent } from "./pages/project-docs-details-page/project-docs-details-page.component";
import { ProjectDocsFormPageComponent } from "./pages/project-docs-form-page/project-docs-form-page.component";


const routes: Routes = [
    { path: "", pathMatch: "full", component: ProjectDocsDetailsPageComponent },
    { path: "edit", component: ProjectDocsFormPageComponent }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule,
    ]
})
export class DocsRoutingModule {

}

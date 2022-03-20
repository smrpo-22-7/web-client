import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProjectStoriesPageComponent } from "./pages/project-stories-page/project-stories-page.component";

const routes: Routes = [
    { path: "", pathMatch: "full", component: ProjectStoriesPageComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule,
    ]
})
export class StoriesRoutingModule {

}

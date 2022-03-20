import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProjectStoriesPageComponent } from "./pages/project-stories-page/project-stories-page.component";
import { StoryFormPageComponent } from "./pages/story-form-page/story-form-page.component";
import { SprintFormPageComponent } from "../sprints/pages/sprint-form-page/sprint-form-page.component";


const routes: Routes = [
    { path: "", pathMatch: "full", component: ProjectStoriesPageComponent },
    { path: "story/new", component: StoryFormPageComponent },
    { path: "sprint/new", component: SprintFormPageComponent }

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

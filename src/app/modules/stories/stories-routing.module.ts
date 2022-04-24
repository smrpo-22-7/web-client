import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProjectStoriesPageComponent } from "./pages/project-stories-page/project-stories-page.component";
import { StoryFormPageComponent } from "./pages/story-form-page/story-form-page.component";
import {EditStoryComponent} from "./pages/edit-story/edit-story.component";


const routes: Routes = [
    { path: "", pathMatch: "full", component: ProjectStoriesPageComponent },
    { path: ":storyId/edit", component: EditStoryComponent },
    { path: "new", component: StoryFormPageComponent },


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

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { ProjectStoriesPageComponent } from "./pages/project-stories-page/project-stories-page.component";
import { StoryFormPageComponent } from "./pages/story-form-page/story-form-page.component";
import { StoriesRoutingModule } from "./stories-routing.module";
import { EditStoryComponent } from './pages/edit-story/edit-story.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        StoriesRoutingModule,
    ],
    declarations: [
        ProjectStoriesPageComponent,
        StoryFormPageComponent,
        EditStoryComponent,
    ]
})
export class StoriesModule {

}

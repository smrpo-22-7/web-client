import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { SprintsRoutingModule } from "../sprints/sprints-routing.module";
import { ProjectStoriesPageComponent } from "./pages/project-stories-page/project-stories-page.component";
import { StoryFormPageComponent } from "./pages/story-form-page/story-form-page.component";
import { StoriesRoutingModule } from "./stories-routing.module";
import { AddStoryDialogComponent } from './components/add-story-dialog/add-story-dialog.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        StoriesRoutingModule,
        SprintsRoutingModule
    ],
    declarations: [
        ProjectStoriesPageComponent,
        StoryFormPageComponent,
        AddStoryDialogComponent
    ]
})
export class StoriesModule {

}

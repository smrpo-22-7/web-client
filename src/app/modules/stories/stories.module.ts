import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { SprintsRoutingModule } from "../sprints/sprints-routing.module";
import { ProjectStoriesPageComponent } from "./pages/project-stories-page/project-stories-page.component";
import { StoryFormPageComponent } from "./pages/story-form-page/story-form-page.component";
import { StoriesRoutingModule } from "./stories-routing.module";
import { StoryListHeaderComponent } from './components/story-list-header/story-list-header.component';
import { StoryListContentComponent } from './components/story-list-content/story-list-content.component';
import { StoryTasksDialogComponent } from './components/story-tasks-dialog/story-tasks-dialog.component';
import { TaskListRowComponent } from './components/story-tasks-dialog/task-list-row/task-list-row.component';


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
        StoryListHeaderComponent,
        StoryListContentComponent,
        StoryTasksDialogComponent,
        TaskListRowComponent,
    ]
})
export class StoriesModule {

}

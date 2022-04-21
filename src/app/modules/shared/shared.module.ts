import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ValidationErrorComponent } from "./components/validation-error/validation-error.component";
import { HasErroredDirective } from "./directives/has-errored.directive";
import { BootstrapModule } from "./bootstrap.module";
import { IconsModule } from "./icons.module";
import { ConfirmDialogComponent } from "./components/confirm-dialog/confirm-dialog.component";
import { NgForTrackByIdDirective } from "./directives/base-type-track-by.directive";
import { SafeHtmlPipe } from "./pipes/safe-html.pipe";
import { PrettifyArrayPipe } from "./pipes/prettify-array.pipe";
import { UserInitialsIconComponent } from "./components/user-initials-icon/user-initials-icon.component";
import { StoryListHeaderComponent } from "./components/story-list-header/story-list-header.component";
import { StoryListContentComponent } from "./components/story-list-content/story-list-content.component";
import { StoryTasksDialogComponent } from "./components/story-tasks-dialog/story-tasks-dialog.component";
import { TaskListRowComponent } from "./components/story-tasks-dialog/task-list-row/task-list-row.component";
import { NumbersOnlyDirective } from './directives/numbers-only.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        BootstrapModule,
        IconsModule,
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        ValidationErrorComponent,
        HasErroredDirective,
        BootstrapModule,
        IconsModule,
        NgForTrackByIdDirective,
        SafeHtmlPipe,
        PrettifyArrayPipe,
        UserInitialsIconComponent,
        StoryListHeaderComponent,
        StoryListContentComponent,
        StoryTasksDialogComponent,
        TaskListRowComponent,
        NumbersOnlyDirective,
    ],
    declarations: [
        ValidationErrorComponent,
        HasErroredDirective,
        ConfirmDialogComponent,
        NgForTrackByIdDirective,
        SafeHtmlPipe,
        PrettifyArrayPipe,
        UserInitialsIconComponent,
        StoryListHeaderComponent,
        StoryListContentComponent,
        StoryTasksDialogComponent,
        TaskListRowComponent,
        NumbersOnlyDirective,
    ]
})
export class SharedModule {

}

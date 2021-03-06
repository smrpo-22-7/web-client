import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ValidationErrorComponent } from "./components/validation-error/validation-error.component";
import { HasErroredDirective } from "./directives/has-errored.directive";
import { BootstrapModule } from "./bootstrap.module";
import { IconsModule } from "./icons.module";
import { ConfirmDialogComponent } from "./components/confirm-dialog/confirm-dialog.component";
import { NgForTrackByIdDirective, NgForTrackByPropDirective } from "./directives/base-type-track-by.directive";
import { SafeHtmlPipe } from "./pipes/safe-html.pipe";
import { PrettifyArrayPipe } from "./pipes/prettify-array.pipe";
import { UserInitialsIconComponent } from "./components/user-initials-icon/user-initials-icon.component";
import { StoryListHeaderComponent } from "./components/story-list-header/story-list-header.component";
import { StoryListContentComponent } from "./components/story-list-content/story-list-content.component";
import { StoryTasksDialogComponent } from "./components/story-tasks-dialog/story-tasks-dialog.component";
import { TaskListRowComponent } from "./components/story-tasks-dialog/task-list-row/task-list-row.component";
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { FriendlyDatePipe } from './pipes/friendly-date.pipe';
import { RejectStoryDialogComponent } from './components/reject-story-dialog/reject-story-dialog.component';
import { FriendlyTimePipe } from './pipes/friendly-time.pipe';
import { FriendlySecondsPipe } from './pipes/friendly-seconds.pipe';
import { ShortStringPipe } from './pipes/short-string.pipe';
import { TaskHoursDialogComponent } from './components/task-hours-dialog/task-hours-dialog.component';

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
        NgForTrackByPropDirective,
        SafeHtmlPipe,
        PrettifyArrayPipe,
        UserInitialsIconComponent,
        StoryListHeaderComponent,
        StoryListContentComponent,
        StoryTasksDialogComponent,
        TaskListRowComponent,
        NumbersOnlyDirective,
        FriendlyDatePipe,
        FriendlyTimePipe,
        FriendlySecondsPipe,
        ShortStringPipe,
    ],
    declarations: [
        ValidationErrorComponent,
        HasErroredDirective,
        ConfirmDialogComponent,
        NgForTrackByIdDirective,
        NgForTrackByPropDirective,
        SafeHtmlPipe,
        PrettifyArrayPipe,
        UserInitialsIconComponent,
        StoryListHeaderComponent,
        StoryListContentComponent,
        StoryTasksDialogComponent,
        TaskListRowComponent,
        NumbersOnlyDirective,
        FriendlyDatePipe,
        RejectStoryDialogComponent,
        FriendlyTimePipe,
        FriendlySecondsPipe,
        ShortStringPipe,
        TaskHoursDialogComponent,
    ],
    providers: [
        DatePipe,
    ]
})
export class SharedModule {

}

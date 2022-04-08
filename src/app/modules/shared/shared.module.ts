import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ValidationErrorComponent } from "./components/validation-error/validation-error.component";
import { HasErroredDirective } from "./directives/has-errored.directive";
import { BootstrapModule } from "./bootstrap.module";
import { IconsModule } from "./icons.module";
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { NgForTrackByIdDirective } from './directives/base-type-track-by.directive';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { PrettifyArrayPipe } from './pipes/prettify-array.pipe';

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
    ],
    declarations: [
        ValidationErrorComponent,
        HasErroredDirective,
        ConfirmDialogComponent,
        NgForTrackByIdDirective,
        SafeHtmlPipe,
        PrettifyArrayPipe,
    ]
})
export class SharedModule {

}

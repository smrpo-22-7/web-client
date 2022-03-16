import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ValidationErrorComponent } from "./components/validation-error/validation-error.component";
import { HasErroredDirective } from "./directives/has-errored.directive";
import { BootstrapModule } from "./bootstrap.module";
import { IconsModule } from "./icons.module";

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
    ],
    declarations: [
        ValidationErrorComponent,
        HasErroredDirective,
    ]
})
export class SharedModule {

}

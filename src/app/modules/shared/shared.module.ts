import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ValidationErrorComponent } from './components/validation-error/validation-error.component';
import { HasErroredDirective } from './directives/has-errored.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        ValidationErrorComponent,
        HasErroredDirective,
    ],
    declarations: [
    
    
    ValidationErrorComponent,
                HasErroredDirective
  ]
})
export class SharedModule {

}

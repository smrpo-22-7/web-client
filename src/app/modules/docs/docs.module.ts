import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { DocsRoutingModule } from "./docs-routing.module";
import { ProjectDocsDetailsPageComponent } from './pages/project-docs-details-page/project-docs-details-page.component';
import { ProjectDocsFormPageComponent } from './pages/project-docs-form-page/project-docs-form-page.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DocsRoutingModule,
    ],
    exports: [
    
    ],
    declarations: [
      ProjectDocsDetailsPageComponent,
      ProjectDocsFormPageComponent
    ]
})
export class DocsModule {

}

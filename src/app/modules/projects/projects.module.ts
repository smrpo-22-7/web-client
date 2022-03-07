import { NgModule } from "@angular/core";
import { ProjectsListPageComponent } from './pages/projects-list-page/projects-list-page.component';
import { ProjectFormPageComponent } from './pages/project-form-page/project-form-page.component';
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { ProjectsRoutingModule } from "./projects-routing.module";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ProjectsRoutingModule,
    ],
    declarations: [
      ProjectsListPageComponent,
      ProjectFormPageComponent
    ]
})
export class ProjectsModule {

}

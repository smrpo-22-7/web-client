import { NgModule } from "@angular/core";
import { ProjectsListPageComponent } from './pages/projects-list-page/projects-list-page.component';
import { ProjectFormPageComponent } from './pages/project-form-page/project-form-page.component';
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { ProjectsRoutingModule } from "./projects-routing.module";
import { ProjectDetailsPageComponent } from './pages/project-details-page/project-details-page.component';
import { ProjectMembersListComponent } from './pages/project-details-page/project-members-list/project-members-list.component';
import { ProjectWallComponent } from './pages/project-details-page/project-wall/project-wall.component';
import { WallPostFormComponent } from './pages/project-details-page/project-wall/wall-post-form/wall-post-form.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ProjectsRoutingModule,
    ],
    declarations: [
      ProjectsListPageComponent,
      ProjectFormPageComponent,
      ProjectDetailsPageComponent,
      ProjectMembersListComponent,
      ProjectWallComponent,
      WallPostFormComponent
    ]
})
export class ProjectsModule {

}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
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
      ProjectDetailsPageComponent,
      ProjectMembersListComponent,
      ProjectWallComponent,
      WallPostFormComponent
    ]
})
export class ProjectsModule {

}

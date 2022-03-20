import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { SprintsRoutingModule } from "../sprints/sprints-routing.module";
import { ProjectStoriesPageComponent } from "./pages/project-stories-page/project-stories-page.component";


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        SprintsRoutingModule,
    ],
    declarations: [
        ProjectStoriesPageComponent
    ]
})
export class StoriesModule {

}

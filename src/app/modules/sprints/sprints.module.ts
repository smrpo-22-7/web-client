import { NgModule } from "@angular/core";
import { ProjectSprintsListPageComponent } from './pages/project-sprints-list-page/project-sprints-list-page.component';
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { SprintsRoutingModule } from "./sprints-routing.module";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        SprintsRoutingModule,
    ],
    declarations: [
      ProjectSprintsListPageComponent
    ]
})
export class SprintsModule {

}

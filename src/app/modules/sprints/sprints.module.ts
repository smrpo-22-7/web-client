import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { SprintsRoutingModule } from "./sprints-routing.module";
import { SprintFormPageComponent } from "./pages/sprint-form-page/sprint-form-page.component";
import { ProjectSprintsListPageComponent } from "./pages/project-sprints-list-page/project-sprints-list-page.component";
import { SprintRowComponent } from './components/sprint-row/sprint-row.component';
import { SprintDetailsPageComponent } from './pages/sprint-details-page/sprint-details-page.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        SprintsRoutingModule,
    ],
    declarations: [
        ProjectSprintsListPageComponent,
        SprintFormPageComponent,
        SprintRowComponent,
        SprintDetailsPageComponent
    ]
})
export class SprintsModule {

}

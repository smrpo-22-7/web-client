import { NgModule } from "@angular/core";
import { AdminPanelPageComponent } from "./pages/admin-panel-page/admin-panel-page.component";
import { UsersListPageComponent } from "./pages/users-list-page/users-list-page.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { AdminRoutingModule } from "./admin-routing.module";
import { RouterModule } from "@angular/router";
import { UserFormPageComponent } from "./pages/user-form-page/user-form-page.component";
import { ProjectFormPageComponent } from "./pages/project-form-page/project-form-page.component";
import { ProjectListPageComponent } from './pages/project-list-page/project-list-page.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AdminRoutingModule,
    ],
    declarations: [
        AdminPanelPageComponent,
        UsersListPageComponent,
        UserFormPageComponent,
        ProjectFormPageComponent,
        ProjectListPageComponent
    ]
})
export class AdminModule {

}

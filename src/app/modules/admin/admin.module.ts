import { NgModule } from "@angular/core";
import { AdminPanelPageComponent } from './pages/admin-panel-page/admin-panel-page.component';
import { UsersListPageComponent } from './pages/users-list-page/users-list-page.component';
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { AdminRoutingModule } from "./admin-routing.module";
import { RouterModule } from "@angular/router";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AdminRoutingModule,
    ],
    declarations: [
      AdminPanelPageComponent,
      UsersListPageComponent
    ]
})
export class AdminModule {

}

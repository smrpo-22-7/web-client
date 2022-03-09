import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminPanelPageComponent } from "./pages/admin-panel-page/admin-panel-page.component";
import { UsersListPageComponent } from "./pages/users-list-page/users-list-page.component";
import { UserFormPageComponent } from "./pages/user-form-page/user-form-page.component";

const routes: Routes = [
    { path: "", pathMatch: "full", component: AdminPanelPageComponent },
    { path: "users", component: UsersListPageComponent },
    { path: "users/new", component: UserFormPageComponent }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule,
    ]
})
export class AdminRoutingModule {

}

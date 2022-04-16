import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminPanelPageComponent } from "./pages/admin-panel-page/admin-panel-page.component";
import { UsersListPageComponent } from "./pages/users-list-page/users-list-page.component";
import { UserFormPageComponent } from "./pages/user-form-page/user-form-page.component";
import { ProjectFormPageComponent } from "./pages/project-form-page/project-form-page.component";
import { ProjectListPageComponent } from "./pages/project-list-page/project-list-page.component";

const routes: Routes = [
    { path: "", pathMatch: "full", component: AdminPanelPageComponent },
    { path: "users", component: UsersListPageComponent },
    { path: "users/new", component: UserFormPageComponent },
    { path: "projects", component: ProjectListPageComponent },
    { path: "projects/new", component: ProjectFormPageComponent },
    {
        path: "projects/:projectId",
        loadChildren: () => import("../project-admin/project-admin.module").then(m => m.ProjectAdminModule),
        data: {context: "ADMIN"}
    }
];

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

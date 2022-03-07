import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { LandingPageComponent } from "./pages/landing-page/landing-page.component";
import { ErrorPageComponent } from "./pages/error-page/error-page.component";
import { OidcCallbackPageComponent } from "./pages/oidc-callback-page/oidc-callback-page.component";

const routes: Routes = [
    {
        path: "", component: LayoutComponent, children: [
            { path: "", pathMatch: "full", component: LandingPageComponent },
            { path: "admin", loadChildren: () => import("../admin/admin.module").then(m => m.AdminModule) },
            { path: "projects", loadChildren: () => import("../projects/projects.module").then(m => m.ProjectsModule) },
            { path: "sprints", loadChildren: () => import("../sprints/sprints.module").then(m => m.SprintsModule) },
            { path: "error/:status", component: ErrorPageComponent },
        ]
    },
    { path: "callback/oidc", pathMatch: "full", component: OidcCallbackPageComponent },
    { path: "**", redirectTo: "/error/404" }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            paramsInheritanceStrategy: "always"
        })
    ],
    exports: [
        RouterModule,
    ]
})
export class RootRoutingModule {

}

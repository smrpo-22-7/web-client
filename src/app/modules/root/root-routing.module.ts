import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { LandingPageComponent } from "./pages/landing-page/landing-page.component";
import { ErrorPageComponent } from "./pages/error-page/error-page.component";
import { AdminGuard, AuthenticatedChildGuard } from "@services";

const routes: Routes = [
    {
        path: "", component: LayoutComponent, children: [
            { path: "", pathMatch: "full", component: LandingPageComponent },
            {
                path: "admin",
                loadChildren: () => import("../admin/admin.module").then(m => m.AdminModule),
                canActivateChild: [AdminGuard]
            },
            {
                path: "projects/:projectId/stories",
                loadChildren: () => import("../stories/stories.module").then(m => m.StoriesModule),
                canActivateChild: [AuthenticatedChildGuard]
            },
            {
                path: "projects",
                loadChildren: () => import("../projects/projects.module").then(m => m.ProjectsModule),
                canActivateChild: [AuthenticatedChildGuard]
            },
            {
                path: "projects/:projectId/sprints",
                loadChildren: () => import("../sprints/sprints.module").then(m => m.SprintsModule),
                canActivateChild: [AuthenticatedChildGuard]
            },
            {
                path: "projects/:projectId/docs",
                loadChildren: () => import("../docs/docs.module").then(m => m.DocsModule),
                canActivateChild: [AuthenticatedChildGuard]
            },
            {
                path: "projects/:projectId/manage",
                loadChildren: () => import("../project-admin/project-admin.module").then(m => m.ProjectAdminModule),
                canActivateChild: [AuthenticatedChildGuard],
                data: {context: "PROJECT"}
            },
            {
                path: "user-profile",
                loadChildren: () => import("../user-profile/user-profile.module").then(m => m.UserProfileModule),
                canActivateChild: [AuthenticatedChildGuard]
            },
            { path: "error/:status", component: ErrorPageComponent },
        ]
    },
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

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { RootRoutingModule } from "./root-routing.module";
import { SessionCheckComponent } from "./components/session-check/session-check.component";
import { OidcCallbackPageComponent } from "./pages/oidc-callback-page/oidc-callback-page.component";
import { HeaderComponent } from './components/header/header.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RootRoutingModule,
    ],
    declarations: [
        LayoutComponent,
        LandingPageComponent,
        ErrorPageComponent,
        SessionCheckComponent,
        OidcCallbackPageComponent,
        HeaderComponent,
    ],
    exports: [
        RouterModule,
    ]
})
export class RootModule {

}

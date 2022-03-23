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
import { HeaderComponent } from './components/header/header.component';
import { ProjectPickerComponent } from './components/project-picker/project-picker.component';
import { UserIconComponent } from './components/header/user-icon/user-icon.component';
import { UserLandingComponent } from './pages/landing-page/user-landing/user-landing.component';
import { AnonLandingComponent } from './pages/landing-page/anon-landing/anon-landing.component';


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
        HeaderComponent,
        ProjectPickerComponent,
        UserIconComponent,
        UserLandingComponent,
        AnonLandingComponent,
    ],
    exports: [
        RouterModule,
    ]
})
export class RootModule {

}

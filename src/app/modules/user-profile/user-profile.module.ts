import { NgModule } from "@angular/core";
import { UserProfilePageComponent } from "./pages/user-profile-page/user-profile-page.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { UserProfileRoutingModule } from "./user-profile-routing.module";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        UserProfileRoutingModule,
    ],
    declarations: [
        UserProfilePageComponent
    ]
})
export class UserProfileModule {

}

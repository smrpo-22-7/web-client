import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { RootModule } from "./modules/root/root.module";
import { ApiInterceptor, AuthInterceptor } from "@services";
import { AppConfigFactory } from "./factories";
import { NavContext } from "@context";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        RootModule,
        HttpClientModule,
    ],
    providers: [
        { provide: APP_INITIALIZER, useFactory: AppConfigFactory, deps: [NavContext], multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

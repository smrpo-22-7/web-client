import { APP_INITIALIZER, LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import localeSl from "@angular/common/locales/sl";

import { AppComponent } from "./app.component";
import { RootModule } from "./modules/root/root.module";
import { ApiInterceptor, AuthInterceptor, AuthService } from "@services";
import { AppConfigFactory } from "./factories";
import { NavContext } from "@context";
import { registerLocaleData } from "@angular/common";

registerLocaleData(localeSl);

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
        { provide: APP_INITIALIZER, useFactory: AppConfigFactory, deps: [NavContext, AuthService], multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: LOCALE_ID, useValue: "sl-SI" },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

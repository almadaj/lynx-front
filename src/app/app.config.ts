import { ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideClientHydration, withEventReplay } from "@angular/platform-browser";
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { credentialsInterceptor } from "./core/interceptor/credentials.interceptor";
import { authErrorInterceptor } from "./core/interceptor/auth-error.interceptor";
import { authInterceptor } from "./core/interceptor/auth.interceptor";


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        credentialsInterceptor,
        authErrorInterceptor,
        authInterceptor
      ])
    )
  ]
};
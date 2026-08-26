import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { credentialsInterceptor } from './core/interceptor/credentials.interceptor';
import { AuthService } from './services/api-services/auth.service';
import { catchError, of, tap } from 'rxjs';
import { authErrorInterceptor } from './core/interceptor/auth-error.interceptor';

export const appConfig: ApplicationConfig = {

  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        credentialsInterceptor,
        authErrorInterceptor
      ])
    )
  ]
};
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes'; // This now correctly imports the exported routes
import { AuthInterceptorService } from './services/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Provide the application with all the routes we just defined
    provideRouter(routes),

    // Provide the HttpClient so our services can make API calls
    provideHttpClient(withInterceptorsFromDi()),

    // Provide the AuthInterceptor to automatically add the login token to API requests
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ]
};
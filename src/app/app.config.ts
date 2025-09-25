import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// This line IMPORTS the routes array from the file you sent me.
import { routes } from './app.routes'; 
import { AuthInterceptorService } from './services/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // This line tells your application to USE the routes we just imported.
    // This is the most important part of the fix.
    provideRouter(routes),

    // These lines provide the necessary tools for making API calls and using the interceptor.
    provideHttpClient(withInterceptorsFromDi()),
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptorService, 
      multi: true 
    }
  ]
};
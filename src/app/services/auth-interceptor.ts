import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from './auth';
import { Observable } from 'rxjs'; // We need to import Observable for the return type

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  // The intercept method must return an Observable<HttpEvent<any>>
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();

    // If a token exists, add the Authorization header
    if (token) {
      // Clone the request to add the new header, because requests are immutable
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      // Pass the cloned request to the next handler
      return next.handle(cloned);
    }

    // If there's no token, pass the original request along without modification
    return next.handle(req);
  }
}
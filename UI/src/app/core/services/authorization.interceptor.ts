import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LoginServiceComponent } from './login.service';
import { catchError } from "rxjs/operators";
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  static statusCode: any;
  constructor(private injector: Injector, private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let loginService = this.injector.get(LoginServiceComponent)
    let tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `bearer ${loginService.getToken()}`
      }
    })

    return next.handle(tokenizedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log("ERROR",error.status)
        TokenInterceptorService.statusCode=error.status;
        if (error.status !== 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigate(['/']);
        }
        return throwError(error);
      }))

  }
}

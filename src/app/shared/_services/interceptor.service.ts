import { HttpContext, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthenticationService } from "src/app/public/_services/authentication.service";

@Injectable()
export class InterceptorService implements HttpInterceptor {

  securedApiPoints: string[] = [
    'like','dislike', 'notes'
  ];

  constructor(private authenticationService: AuthenticationService) {}

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const httpHeaders = {
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Headers': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    }
    let interceptedHttpRequest = httpRequest.clone({setHeaders: httpHeaders});
    // Si la ressource demandée requiert une authorisation particulière
    if (this.isSecuredRequest(httpRequest)) {
      const securedHttpHeaders = Object.assign(httpHeaders, {
        'Authorization': 'Bearer ' + this.authenticationService.getAuthenticationData().bearerToken
      });
      const securedHttpRequest = interceptedHttpRequest.clone({setHeaders: securedHttpHeaders});
      return next.handle(securedHttpRequest);
    }
    return next.handle(interceptedHttpRequest);
  }

  isSecuredRequest(httpRequest: HttpRequest<any>): boolean {
    return this.securedApiPoints.some(x => httpRequest.url.split('/').includes(x));
  }
}
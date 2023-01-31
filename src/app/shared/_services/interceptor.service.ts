import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class InterceptorService implements HttpInterceptor {

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headerParams = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': '*',
      'Content-Type': 'application/json'
    };
    let interceptedHttpRequest = httpRequest.clone({setHeaders: headerParams});
    console.log('Ça passe dans l\'intercepteur !');
    return next.handle(interceptedHttpRequest);
  }
}
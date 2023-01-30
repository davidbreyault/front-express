import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, tap } from "rxjs";
import { TokenService } from "src/app/shared/_services/token.service";
import { Authentication } from "../_models/authentication.model";
import { CredentialsAuthentication } from "../_models/credentials-authentication.model";
import { BasicAuthenticationService } from "./basic-authentication.service";

@Injectable()
export class AuthenticationService {

  private authenticationData!: Authentication;
  private authenticationDataSubject: Subject<Authentication> = new Subject<Authentication>();

  constructor(
    private tokenService: TokenService, 
    private basicAuthenticationService: BasicAuthenticationService) { }

  getAuthenticationData(): Authentication {
    return this.authenticationData;
  }

  getAuthenticationDataSubject(): Observable<Authentication> {
    return this.authenticationDataSubject.asObservable();
  }

  logIn(credentials: CredentialsAuthentication): Observable<HttpResponse<any>> {
    return this.basicAuthenticationService.authenticate(credentials)
      .pipe(
        tap(response => {
          if (response.status === 200) {
            this.createAuthenticationSession(response);
          }
        })
      );
  }

  logInWithJwt(): void {

  }

  logOut(): void {

  }

  private createAuthenticationSession(httpResponse: HttpResponse<any>): void {
    // Nouvelle instance d'authentification
    const authentication: Authentication = new Authentication();
    authentication.isAuthenticated = true;
    // Récupération et stockage du token
    authentication.bearerToken = httpResponse.headers.get('Authorization')!;
    this.tokenService.setToken(authentication.bearerToken);
    // Stockage du nom d'utilisateur
    authentication.usernameFromJwt = this.tokenService.getUsernameFromJwt();
    this.authenticationData = authentication;
    this.emitAuthenticationDataSubject();
  }

  emitAuthenticationDataSubject(): void {
    this.authenticationDataSubject.next(this.authenticationData);
  }
}
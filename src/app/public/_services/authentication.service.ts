import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, tap } from "rxjs";
import { TokenService } from "src/app/shared/_services/token.service";
import { Authentication } from "../_models/authentication.model";
import { CredentialsAuthentication } from "../_models/credentials-authentication.model";
import { BasicAuthenticationService } from "./basic-authentication.service";

@Injectable()
export class AuthenticationService {

  private authenticationData: Authentication = this.initAuthentication();
  private authenticationDataSubject: Subject<Authentication> = new Subject<Authentication>();

  constructor(
    private tokenService: TokenService, 
    private basicAuthenticationService: BasicAuthenticationService
  ) {
    this.emitAuthenticationDataSubject();
  }

  getAuthenticationDataSubject(): Observable<Authentication> {
    return this.authenticationDataSubject.asObservable();
  }

  private initAuthentication(): Authentication {
    const authentication = new Authentication();
    authentication.isAuthenticated = false;
    authentication.bearerToken = null;
    authentication.usernameFromJwt = null;
    return authentication;
  }

  private resetAuthentication(): Authentication {
    return this.initAuthentication();
  }

  private createAuthenticationSession(token: string): void {
    // Nouvelle instance d'authentification
    this.authenticationData.isAuthenticated = true;
    // Récupération et stockage du token
    this.authenticationData.bearerToken = token;
    this.tokenService.setToken(this.authenticationData.bearerToken);
    // Stockage du nom d'utilisateur
    this.authenticationData.usernameFromJwt = this.tokenService.getJwtUsername();
    // Émission de l'instance d'authentification
    this.emitAuthenticationDataSubject();
  }

  logIn(credentials: CredentialsAuthentication): Observable<HttpResponse<any>> {
    return this.basicAuthenticationService.authenticate(credentials)
      .pipe(
        tap((httpResponse: HttpResponse<any>) => {
          if (httpResponse.status === 200) {
            this.createAuthenticationSession(httpResponse.headers.get('Authorization')!);
          }
        })
      );
  }

  logInWithJwt(): void {
    // S'il y a un token dans le local storage
    if (this.tokenService.getToken() !== null) {
      // S'il est toujours valide
      if (!this.tokenService.isTokenHasExpired()) {
        this.createAuthenticationSession(this.tokenService.getToken()!);
      }
    }
  }

  logOut(): void {
    this.authenticationData = this.resetAuthentication();
    this.tokenService.deleteToken();
    this.emitAuthenticationDataSubject();
  }

  emitAuthenticationDataSubject(): void {
    this.authenticationDataSubject.next(this.authenticationData);
  }
}
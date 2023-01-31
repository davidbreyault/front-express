import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { CredentialsRegistration } from "../_models/credentials-registration.model";

@Injectable()
export class RegistrationService {

  constructor(private http: HttpClient) { }

  registrate(credentials: CredentialsRegistration): Observable<HttpResponse<any>> {
    return this.http.post(`${environment.apiRootUrl}/auth/register`, credentials, {observe: "response"});
  }
}
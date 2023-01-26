import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { api } from "src/environments/environment";
import { RegistrationCredentials } from "../_models/registration-credentials.model";

@Injectable()
export class RegistrationService {

  constructor(private http: HttpClient) { }

  registrate(credentials: RegistrationCredentials): Observable<HttpResponse<any>> {
    return this.http.post(`${api.rootUrl}/auth/register`, credentials, {observe: "response"});
  }
}
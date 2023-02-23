import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Buffer } from "buffer";
import { CredentialsAuthentication } from "../_models/credentials-authentication.model";

@Injectable()
export class BasicAuthenticationService {

  constructor(private http: HttpClient) { }

  authenticate(credentials: CredentialsAuthentication): Observable<HttpResponse<any>> {
    console.log(credentials);
    const encodedCredentials = this.b64Encoder(credentials.username + ':' + credentials.password);
    console.log(encodedCredentials);
    const httpHeaders= new HttpHeaders().append('Authorization', 'Basic ' + encodedCredentials);
    return this.http.post(
      environment.apiRootUrl + '/auth/authenticate', 
      encodedCredentials, 
      {headers: httpHeaders, observe: 'response'}
    );
  }

  b64Encoder(stringToEncode: string): string {
    return Buffer.from(stringToEncode).toString('base64');
  }
} 
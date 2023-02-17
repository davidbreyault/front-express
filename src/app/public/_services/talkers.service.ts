import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { ResponseTalkers } from "../_models/response-talkers.model";

@Injectable()
export class TalkersService {

  constructor(private http: HttpClient) {}

  getAllTalkers(): Observable<ResponseTalkers> {
    return this.http.get<ResponseTalkers>(environment.apiRootUrl + '/talkers')
      .pipe(
        tap((response: ResponseTalkers) => response['talkers'] = new Map(Object.entries(response['talkers']).sort((a, b) => 
          (b[1].notes + b[1].comments) - (a[1].notes + a[1].comments)))
        )
      );
  }
}
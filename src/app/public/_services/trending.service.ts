import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ResponseTrending } from "../_models/response-trending.model";

@Injectable()
export class TrendingService {

  constructor(private http: HttpClient) {}

  getTrendingWords(): Observable<ResponseTrending> {
    return this.http.get<ResponseTrending>(environment.apiRootUrl + '/trending');
  }
}
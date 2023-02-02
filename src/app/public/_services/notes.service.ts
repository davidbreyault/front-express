import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ResponseNotes } from "../_models/response-notes.model";
import { ResponseSuccess } from "../_models/response-success.model";

@Injectable()
export class NotesService {

  constructor(private http: HttpClient) {}

  getAllNotes(): Observable<ResponseNotes> {
    return this.http.get<ResponseNotes>(environment.apiRootUrl + '/notes');
  }

  likeNote(id: number): Observable<HttpResponse<ResponseSuccess>> {
    return this.http.put<ResponseSuccess>(
      environment.apiRootUrl + '/notes/like/' + id, id, {observe: 'response'}
    );
  }

  dislikeNote(id: number): Observable<HttpResponse<ResponseSuccess>> {
    return this.http.put<ResponseSuccess>(
      environment.apiRootUrl + '/notes/dislike/' + id, id, {observe: 'response'}
    )
  }
}
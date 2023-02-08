import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { Note } from "../_models/note.model";
import { ResponseNotes } from "../_models/response-notes.model";
import { ResponseSuccess } from "../_models/response-success.model";

@Injectable()
export class NotesService {

  refreshSubject = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  getRefreshSubject(): Observable<boolean> {
    return this.refreshSubject.asObservable();
  }

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

  postNote(note: Note): Observable<any> {
    return this.http.post(environment.apiRootUrl + '/notes', note, {observe: 'response'});
  }

  emitRefreshSubject(): void {
    this.refreshSubject.next(true);
  }
}
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { SearchingData } from "src/app/shared/_models/searching-data.model";
import { environment } from "src/environments/environment";
import { Note } from "../_models/note.model";
import { ResponseNotes } from "../_models/response-notes.model";
import { ResponseSuccess } from "../_models/response-success.model";

@Injectable()
export class NotesService {

  notesApiPoint: string = 'notes';
  refreshSubject = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  getRefreshSubject(): Observable<boolean> {
    return this.refreshSubject.asObservable();
  }

  getAllNotes(pageNumber: number, pageSize: number, searchingParams?: SearchingData): Observable<ResponseNotes> {
    let url: string = `${environment.apiRootUrl}/${this.notesApiPoint}?page=${pageNumber}&size=${pageSize}`;
    if (searchingParams && searchingParams.searchingTerm.length > 0) {
      url = url.concat('', `&${searchingParams.searchingType}=${searchingParams.searchingTerm}`);
    }
    return this.http.get<ResponseNotes>(url);
  }

  getBestNotes(topParameter: number): Observable<ResponseNotes> {
    return this.http.get<ResponseNotes>(`${environment.apiRootUrl}/${this.notesApiPoint}/best?top=${topParameter}`);
  }

  likeNote(id: number): Observable<HttpResponse<ResponseSuccess>> {
    return this.http.put<ResponseSuccess>(
      `${environment.apiRootUrl}/${this.notesApiPoint}/like/${id}`, 
      id, 
      {observe: 'response'}
    );
  }

  dislikeNote(id: number): Observable<HttpResponse<ResponseSuccess>> {
    return this.http.put<ResponseSuccess>(
      `${environment.apiRootUrl}/${this.notesApiPoint}/dislike/${id}`, 
      id, 
      {observe: 'response'}
    )
  }

  postNote(note: Note): Observable<HttpResponse<any>> {
    return this.http.post(
      `${environment.apiRootUrl}/${this.notesApiPoint}`, 
      note, 
      {observe: 'response'});
  }

  updateNote(note: Note): Observable<HttpResponse<any>> {
    return this.http.put(
      `${environment.apiRootUrl}/${this.notesApiPoint}/${note.id}`, 
      note, 
      {observe: 'response'});
  }

  deleteNote(note: Note): Observable<HttpResponse<any>> {
    return this.http.delete(`${environment.apiRootUrl}/${this.notesApiPoint}/${note.id}`, {observe: 'response'});
  }

  emitRefreshSubject(): void {
    this.refreshSubject.next(true);
  }
}
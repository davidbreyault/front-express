import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { Note } from "../_models/note.model";
import { ResponseNotes } from "../_models/response-notes.model";
import { ResponseSuccess } from "../_models/response-success.model";
import { SortingData } from "src/app/shared/_models/sorting-data.model";
import { NoteSearchingData } from "src/app/shared/_models/note-searching-data.model";
import { DatesHandler } from "src/app/shared/_utils/dates-handler";

@Injectable()
export class NotesService {

  notesApiPoint: string = 'notes';
  refreshSubject = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  getRefreshSubject(): Observable<boolean> {
    return this.refreshSubject.asObservable();
  }

  getAllNotes(pageNumber: number, pageSize: number, searchingParams?: NoteSearchingData, sortingParams?: SortingData): Observable<ResponseNotes> {
    let url: string = `${environment.apiRootUrl}/${this.notesApiPoint}?page=${pageNumber}&size=${pageSize}`;
    if (searchingParams) {
      url += this.addSearchingParameters(searchingParams);
    }
    if (sortingParams && sortingParams.field && sortingParams.direction) {
      url += `&sort=${sortingParams.field},${sortingParams.direction}`;
    }
    return this.http.get<ResponseNotes>(url);
  }

  private addSearchingParameters(searchingParams: NoteSearchingData): string {
    let parametersChain = '';
    const {username, noteKeyword, dateStart, dateEnd} = searchingParams;
      if (username) {
        parametersChain += `&username=${username}`;
      }
      if (noteKeyword) {
        parametersChain += `&keyword=${noteKeyword}`;
      }
      if (dateStart) {
        parametersChain += `&dateStart=${DatesHandler.toDateString(dateStart)}`;
      }
      if (dateEnd) {
        parametersChain += `&dateEnd=${DatesHandler.toDateString(dateEnd)}`;
      }
    return parametersChain;
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
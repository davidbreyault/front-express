import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { api } from "src/environments/environment";
import { Note } from "../_models/note.model";
import { ResponseNotes } from "../_models/response-notes.model";

@Injectable()
export class NotesService {

  constructor(private http: HttpClient) {}

  getAllNotes(): Observable<ResponseNotes> {
    return this.http.get<ResponseNotes>(api.rootUrl + '/notes');
  }
}
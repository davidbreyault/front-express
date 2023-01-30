import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ResponseNotes } from "../_models/response-notes.model";

@Injectable()
export class NotesService {

  constructor(private http: HttpClient) {}

  getAllNotes(): Observable<ResponseNotes> {
    return this.http.get<ResponseNotes>(environment.apiRootUrl + '/notes');
  }
}
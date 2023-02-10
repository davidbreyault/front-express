import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Comment } from "../_models/comment.model";

@Injectable()
export class CommentsService {

  constructor(private http: HttpClient) {}

  getNoteComments(noteId: number): Observable<{comments: Comment[]}> {
    return this.http.get<{comments: Comment[]}>(environment.apiRootUrl + '/notes/' + noteId + '/comments');
  }
}
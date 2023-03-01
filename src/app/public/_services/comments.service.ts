import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { Comment } from "../_models/comment.model";

@Injectable()
export class CommentsService {

  constructor(private http: HttpClient) {}

  getCommentsNote(noteId: number): Observable<{comments: Comment[]}> {
    return this.http.get<{comments: Comment[]}>(environment.apiRootUrl + '/notes/' + noteId + '/comments')
      .pipe(tap(response => response['comments'].sort((a: Comment, b: Comment) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())));
  }

  postCommentNote(noteId: number, comment: Comment): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(environment.apiRootUrl + '/notes/' + noteId + '/comments', comment, {observe: "response"});
  }

  updateComment(comment: Comment): Observable<HttpResponse<any>> {
    return this.http.put<HttpResponse<any>>(environment.apiRootUrl + '/comments/' + comment.id, comment, {observe: 'response'});
  }

  deleteComment(commentId: number): Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(environment.apiRootUrl + '/comments/' + commentId, {observe: 'response'});
  }
}
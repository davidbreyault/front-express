import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { catchError, take, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { TokenService } from 'src/app/shared/_services/token.service';
import { Affiliations } from '../affiliations';
import { CommentDeletionData } from '../_models/comment-deletion-data.model';
import { CommentUpdatingData } from '../_models/comment-updating-data.model';
import { Comment } from '../_models/comment.model';
import { AuthenticationService } from '../_services/authentication.service';
import { CommentsService } from '../_services/comments.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent extends Affiliations implements OnInit {

  @Input() comment!: Comment;
  isBeingUpdated!: boolean;
  @Output() deletionCommentEvent: EventEmitter<CommentDeletionData> = new EventEmitter<CommentDeletionData>();

  constructor(
    private commentsService: CommentsService,
    protected override tokenService: TokenService, 
    protected override authenticationService: AuthenticationService
  ) {
    super(tokenService, authenticationService);
  }

  ngOnInit(): void {
    this.isBeingUpdated = false;
    this.isPostedByLoggedUser(this.comment);
  }

  onClickUpdateComment(): void {
    this.isBeingUpdated = true;
  }

  renderCommentViewAfterUpdateAction(commentUpdatingData: CommentUpdatingData): void {
    if (commentUpdatingData.isCancelled || commentUpdatingData.isSuccessful) {
      this.isBeingUpdated = false;
    }
  }

  onClickDeleteComment(): void {
    const commentDeletionData: CommentDeletionData = new CommentDeletionData();
    commentDeletionData.comment = this.comment;
    this.commentsService.deleteComment(this.comment.id)
      .pipe(
        take(1),
        tap(response => {
          if (response.status === 200) {
            commentDeletionData.deletionSuccess = true;
            commentDeletionData.deleteMessage = 'Your comment has been deleted successfully';
            commentDeletionData.alertType = AlertType.success;
            this.deletionCommentEvent.emit(commentDeletionData);
          }
        }),
        catchError((httpErrorResponse: HttpErrorResponse) => {
          const message = 'An error occured, cannot delete this comment...';
          commentDeletionData.deletionSuccess = false;
          commentDeletionData.deleteMessage = httpErrorResponse.error ? httpErrorResponse.error + message : message;
          commentDeletionData.alertType = AlertType.error;
          this.deletionCommentEvent.emit(commentDeletionData);
          return throwError(() => httpErrorResponse);
        })
      )
      .subscribe();
  }
}
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, take, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { ErrorValidatorService } from 'src/app/shared/_services/error-validator.service';
import { CommentDeletionData } from '../_models/comment-deletion-data.model';
import { Comment } from '../_models/comment.model';
import { Note } from '../_models/note.model';
import { CommentsService } from '../_services/comments.service';

@Component({
  selector: 'app-comments-layout',
  templateUrl: './comments-layout.component.html',
  styleUrls: ['./comments-layout.component.scss']
})
export class CommentsLayoutComponent implements OnInit {

  commentControl!: FormControl;
  commentPostForm!: FormGroup;
  noteComments!: Comment[];
  isLoadingSpinnerVisible: boolean = true;

  constructor(
    private matDialogRef: MatDialogRef<CommentsLayoutComponent>,
    private commentsService: CommentsService,
    private alertService: AlertService,
    public errorValidatorService: ErrorValidatorService,
    @Inject(MAT_DIALOG_DATA) public data: Note 
  ) {}

  ngOnInit(): void {
    this.getCommentsNote(this.data.id);
    this.matDialogRef.backdropClick().pipe(take(1), tap(() => this.closeDialog(this.noteComments.length))).subscribe();
  }

  private getCommentsNote(noteId: number): void {
    this.commentsService.getCommentsNote(noteId)
      .pipe(
        take(1),
        tap((response: {comments: Comment[]}) => {
          this.noteComments = response['comments'];
          this.isLoadingSpinnerVisible = false;
        }),
        catchError((httpErrorResponse: HttpErrorResponse) => {
          this.isLoadingSpinnerVisible = false;
          const message = httpErrorResponse.error ? httpErrorResponse.error.errors.message : '';
          this.alertService.addAlert('Can\'t get comments. ' + message, AlertType.error, true);
          return throwError(() => httpErrorResponse);
        })
      )
      .subscribe();
  }

  refreshCommentsList(noteId: number): void {
    this.getCommentsNote(noteId);
  }

  onClickCloseCommentsDialog(): void {
    this.closeDialog(this.noteComments.length);
  }

  private closeDialog(updatedCommentsNumber: number): void {
    this.matDialogRef.close(updatedCommentsNumber);
  }

  updateCommentsListAfterDeletion(commentDeletionData: CommentDeletionData): void {
    if (commentDeletionData.deletionSuccess) {
      this.noteComments = this.noteComments.filter(c => c.id !== commentDeletionData.comment.id);
    }
    this.alertService.addAlert(commentDeletionData.deleteMessage, commentDeletionData.alertType, true);
  }
}
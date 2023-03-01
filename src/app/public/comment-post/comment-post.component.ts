import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, take, takeWhile, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { ErrorValidatorService } from 'src/app/shared/_services/error-validator.service';
import { CommentUpdatingData } from '../_models/comment-updating-data.model';
import { Comment } from '../_models/comment.model';
import { AuthenticationService } from '../_services/authentication.service';
import { CommentsService } from '../_services/comments.service';

@Component({
  selector: 'app-comment-post',
  templateUrl: './comment-post.component.html',
  styleUrls: ['./comment-post.component.scss']
})
export class CommentPostComponent implements OnInit, OnDestroy {

  @Input() noteId!: number;
  @Input() isUpdated!: boolean;
  @Input() commentToUpdate!: Comment;
  commentControl!: FormControl;
  commentPostForm!: FormGroup;
  isAuthenticated!: boolean;
  isAlive: boolean = true;
  @Output() commentUpdateEvent: EventEmitter<CommentUpdatingData> = new EventEmitter<CommentUpdatingData>();
  @Output() updateCommentsList: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private formBuilder: FormBuilder,
    private commentsService: CommentsService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    public errorValidatorService: ErrorValidatorService
  ) {}

  ngOnInit(): void {
    this.initFormControl();
    this.createCommentPostForm();
    this.toggleCommentControlAccess();
  }

  private initFormControl(): void {
    this.commentControl = new FormControl(this.commentToUpdate?.message, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ])
  }

  private createCommentPostForm(): void {
    this.commentPostForm = this.formBuilder.group({
      comment: this.commentControl
    })
  }

  private toggleCommentControlAccess(): void {
    this.authenticationService.getAuthenticationDataSubject()
      .pipe(
        takeWhile(() => this.isAlive),
        tap(authenticationData => this.isAuthenticated = authenticationData.isAuthenticated)
      ).subscribe();
  }

  private resetForm(form: FormGroup): void {
    form.reset();
    Object.keys(form.controls).forEach(control => form.controls[control].setErrors(null));
  }

  onSubmitComment(): void {
    const comment = new Comment();
    comment.message = this.commentPostForm.value['comment'];
    // S'il s'agit d'un nouveau commentaire
    this.postComment(comment);
    // S'il s'agit d'une mise à jour de commentaire
    this.updateComment(comment);
  }

  private postComment(comment: Comment): void {
    if (!this.commentToUpdate) {
      this.commentsService.postCommentNote(this.noteId, comment)
        .pipe(
          take(1),
          tap(response => {
            if (response.status === 201) {
              // Déclenche un évenement pour mettre à jour la liste des commentaires.
              this.updateCommentsList.emit(this.noteId);
              this.resetForm(this.commentPostForm);
              this.alertService.addAlert('Your comment has been posted successfully !', AlertType.success, true);
            }
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            const message = httpErrorResponse.error ? httpErrorResponse.error.errors.message : '';
            this.alertService.addAlert('Comment cannot be sent. ' + message, AlertType.error, true);
            return throwError(() => httpErrorResponse);
          }))
        .subscribe();
    }
  }

  private updateComment(comment: Comment): void {
    if (this.commentToUpdate) {
      comment.id = this.commentToUpdate.id;
      this.commentsService.updateComment(comment)
        .pipe(
          take(1),
          tap(response => {
            if (response.status === 200) {
              // Mise à jour du commentaire
              this.commentToUpdate.message = comment.message
              const commentUpdatingData: CommentUpdatingData = new CommentUpdatingData();
              commentUpdatingData.isCancelled = true;
              commentUpdatingData.isSuccessful = false;
              this.commentUpdateEvent.emit(commentUpdatingData);
              this.alertService.addAlert('Your comment has been updated successfully', AlertType.success, true);
            }
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            const message = httpErrorResponse.error ? httpErrorResponse.error.errors.message : 'An error occured. Cannot update comment.';
            this.alertService.addAlert(message, AlertType.error, true);
            return throwError(() => httpErrorResponse);
          })
        )
        .subscribe();
    }
  }

  onClickUpdateCancelled(): void {
    const commentUpdatingData: CommentUpdatingData = new CommentUpdatingData();
    commentUpdatingData.isCancelled = true;
    commentUpdatingData.isSuccessful = false;
    this.commentUpdateEvent.emit(commentUpdatingData);
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
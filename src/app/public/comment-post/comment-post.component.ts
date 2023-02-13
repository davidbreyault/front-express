import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, take, takeWhile, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { ErrorValidatorService } from 'src/app/shared/_services/error-validator.service';
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
  commentControl!: FormControl;
  commentPostForm!: FormGroup;
  isAuthenticated!: boolean;
  isAlive: boolean = true;
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
    this.commentControl = new FormControl('', [
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

  private enableFormField(control: AbstractControl): void {
    control.enable();
  }

  private disableFormField(control: AbstractControl): void {
    control.disable();
  }

  private toggleCommentControlAccess(): void {
    this.authenticationService.getAuthenticationDataSubject()
      .pipe(
        takeWhile(() => this.isAlive),
        tap(authenticationData => {
          this.isAuthenticated = authenticationData.isAuthenticated;
          this.isAuthenticated 
            ? this.enableFormField(this.commentControl) 
            : this.disableFormField(this.commentControl);
        })
      ).subscribe();
  }

  private resetForm(form: FormGroup): void {
    form.reset();
    Object.keys(form.controls).forEach(control => form.controls[control].setErrors(null));
  }

  onSubmitComment(): void {
    const comment = new Comment();
    comment.message = this.commentPostForm.value['comment'];
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

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
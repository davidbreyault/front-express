import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, take, takeWhile, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { ErrorValidatorService } from 'src/app/shared/_services/error-validator.service';
import { Comment } from '../_models/comment.model';
import { Note } from '../_models/note.model';
import { AuthenticationService } from '../_services/authentication.service';
import { CommentsService } from '../_services/comments.service';

@Component({
  selector: 'app-comments-layout',
  templateUrl: './comments-layout.component.html',
  styleUrls: ['./comments-layout.component.scss']
})
export class CommentsLayoutComponent implements OnInit, OnDestroy {

  commentControl!: FormControl;
  commentPostForm!: FormGroup;
  noteComments!: Comment[];
  isAuthenticated!: boolean;
  isAlive: boolean = true;
  isLoadingSpinnerVisible: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<CommentsLayoutComponent>,
    private authenticationService: AuthenticationService,
    private commentsService: CommentsService,
    private alertsService: AlertService,
    public errorValidatorService: ErrorValidatorService,
    @Inject(MAT_DIALOG_DATA) public data: Note 
  ) {}

  ngOnInit(): void {
    this.initFormControl();
    this.createCommentPostForm();
    this.toggleCommentControlAccess();
    this.getNoteComments(this.data.id);
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

  private getNoteComments(noteId: number): void {
    this.commentsService.getNoteComments(noteId)
      .pipe(
        take(1),
        tap(response => {
          this.noteComments = response['comments'];
          this.isLoadingSpinnerVisible = false;
        }),
        catchError((httpErrorResponse: HttpErrorResponse) => {
          this.isLoadingSpinnerVisible = false;
          const message = httpErrorResponse.error ? httpErrorResponse.error.errors.message : '';
          this.alertsService.addAlert('Can\'t get comments. ' + message, AlertType.error, true);
          return throwError(() => httpErrorResponse);
        })
      )
      .subscribe();
  }

  onClickCloseCommentsDialog(): void {
    this.matDialogRef.close();
  }

  onSubmitComment(): void {

  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
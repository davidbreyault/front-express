import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, take, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { ErrorValidatorService } from 'src/app/shared/_services/error-validator.service';
import { Note } from '../_models/note.model';
import { AuthenticationService } from '../_services/authentication.service';
import { NotesService } from '../_services/notes.service';

@Component({
  selector: 'app-note-post',
  templateUrl: './note-post.component.html',
  styleUrls: ['./note-post.component.scss']
})
export class NotePostComponent implements OnInit {

  notePostForm!: FormGroup;
  noteControl!: FormControl;
  usernameControl!: FormControl;
  
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private notesService: NotesService,
    private authenticationService: AuthenticationService,
    private matDialogRef: MatDialogRef<NotePostComponent>,
    public errorValidatorService: ErrorValidatorService,
    @Inject(MAT_DIALOG_DATA) public data: {note?: Note, isPosted: boolean, isUpdated: boolean}
  ) {}

  ngOnInit(): void {
    this.initPostNoteControls();
    this.createNotePostForm();
  }

  private initPostNoteControls(): void {
    this.usernameControl = new FormControl(
      this.authenticationService.getAuthenticationData().usernameFromJwt
    );
    this.noteControl = new FormControl(this.data.note?.note, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(255)
    ]);
  }

  private createNotePostForm(): void {
    this.notePostForm = this.formBuilder.group({
      username: this.usernameControl,
      note: this.noteControl
    })
  }

  onSubmitNotePostForm(): void {
    if (this.notePostForm.valid) {
      const note = new Note();
      note.note = this.notePostForm.value.note
      // S'il s'agit d'un nouveau post
      if (this.data.isPosted) {
        this.postNote(note);
      }
      // S'il s'agit d'une modification
      if (this.data.isUpdated) {
        note.id = this.data.note!.id;
        this.updateNote(note);
      }
    }
  }

  private postNote(note: Note): void {
    this.notesService.postNote(note)
      .pipe(
        take(1),
        tap(response => {
          if (response.status === 201) {
            this.notesService.emitRefreshSubject();
            this.matDialogRef.close();
            this.alertService.addAlert('Your note has been posted successfully !', AlertType.success, false);
          }
        }),
        catchError((httpErrorResponse: HttpErrorResponse) => {
          const message = httpErrorResponse.error ? httpErrorResponse.error : 'An error has occurred...';
          this.alertService.addAlert(message, AlertType.error, true);
          return throwError(() => httpErrorResponse);
        }))
      .subscribe();
  }

  private updateNote(note: Note): void {
    this.notesService.updateNote(note)
      .pipe(
        take(1),
        tap(response => {
          if (response.status === 200) {
            this.notesService.emitRefreshSubject();
            this.matDialogRef.close(note.note);
            this.alertService.addAlert('Your note has been updated successfully !', AlertType.success, false);
          }
        }),
        catchError((httpErrorResponse: HttpErrorResponse) => {
          const message = httpErrorResponse.error ? httpErrorResponse.error : 'An error has occurred...';
          this.alertService.addAlert(message, AlertType.error, true);
          return throwError(() => httpErrorResponse);
        }))
      .subscribe();
  }

  onClickCloseDialog(): void {
    this.matDialogRef.close();
  }
}
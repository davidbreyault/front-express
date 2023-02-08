import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, take, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
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
    private matDialogRef: MatDialogRef<NotePostComponent>
  ) {}

  ngOnInit(): void {
    this.initPostNoteControls();
    this.createPostNoteForm();
  }

  initPostNoteControls(): void {
    this.usernameControl = new FormControl(
      this.authenticationService.getAuthenticationData().usernameFromJwt
    );
    this.noteControl = new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(255)
    ]);
  }

  createPostNoteForm(): void {
    this.notePostForm = this.formBuilder.group({
      username: this.usernameControl,
      note: this.noteControl
    })
  }

  onSubmitNotePostForm(): void {
    if (this.notePostForm.valid) {
      const note = new Note();
      note.note = this.notePostForm.value.note
      this.notesService.postNote(note)
        .pipe(
          take(1),
          tap(response => {
            if (response.status === 201) {
              this.notesService.emitRefreshSubject();
              this.matDialogRef.close();
            }
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            const message = httpErrorResponse.error ? httpErrorResponse.error : 'An error has occurred...';
            this.alertService.addAlert(message, AlertType.error);
            return throwError(() => httpErrorResponse);
          })
        )
        .subscribe();
    }
  }

  onClickCloseDialog(): void {
    this.matDialogRef.close();
  }
}
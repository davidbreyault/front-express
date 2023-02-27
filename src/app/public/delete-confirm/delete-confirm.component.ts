import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, take, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { Note } from '../_models/note.model';
import { NotesService } from '../_services/notes.service';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.scss']
})
export class DeleteConfirmComponent implements OnInit {

  constructor(
    private alertService: AlertService,
    private notesService: NotesService,
    private matDialogRef: MatDialogRef<DeleteConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Note
  ) {}

  ngOnInit(): void {
  }

  onClickDeleteNote(): void {
    this.notesService.deleteNote(this.data)
      .pipe(
        take(1),
        tap((response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.alertService.addAlert(response.body.message, AlertType.success, false);
            this.matDialogRef.close(this.data);
          }
        }),
        catchError((httpErrorResponse: HttpErrorResponse) => {
          const message = httpErrorResponse.error ? httpErrorResponse.error : 'An error occured, Cannot delete this note...';
          this.alertService.addAlert(message, AlertType.error, true);
          return throwError(() => httpErrorResponse);
        })
      )
      .subscribe();
  }

  onClickCloseDialog(): void {
    this.matDialogRef.close();
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, Subject, take, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { DialogInspector } from '../dialog-inspector';
import { Note } from '../_models/note.model';
import { ResponseNotes } from '../_models/response-notes.model';
import { NotesService } from '../_services/notes.service';

@Component({
  selector: 'app-notes-best',
  templateUrl: './notes-best.component.html',
  styleUrls: ['./notes-best.component.scss']
})
export class NotesBestComponent extends DialogInspector implements OnInit, OnDestroy {

  bestNotes!: Note[];
  isLoadingSpinnerVisible: boolean = true;
  destroyComponent$!: Subject<boolean>;
  topParameter!: number;
  topParameterCustomizer: number[] = [5, 10, 20, 50];

  constructor(
    protected override alertService: AlertService,
    private notesService: NotesService,
  ) {
    super(alertService);
  }

  ngOnInit(): void {
    this.topParameter = this.topParameterCustomizer[0];
    this.destroyComponent$ = new Subject<boolean>();
    this.getBestNotes(this.topParameter);
    this.checkDialogOpeningStatus(this.destroyComponent$);
  }

  getBestNotes(topParameter: number): void {
    this.notesService.getBestNotes(topParameter)
      .pipe(
        take(1),
        tap((response: ResponseNotes) => {
          this.bestNotes = response.notes;
          this.isLoadingSpinnerVisible = false;
        }),
        catchError((httpErrorResponse: HttpErrorResponse) => {
          const message = httpErrorResponse.error ? httpErrorResponse.error : 'An error occured, cannot get best notes...';
          setTimeout(() => {
            this.isLoadingSpinnerVisible = false;
            this.alertService.addAlert(message, AlertType.error, false);
          }, 1500);
          return throwError(() => httpErrorResponse);
        })
      ).subscribe();
  }

  onChangeBestNotesParameter(): void {
    this.getBestNotes(this.topParameter);
  }

  ngOnDestroy(): void {
    this.destroyComponent$.next(true);
  }
}
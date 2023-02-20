import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Subject, take, takeWhile, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { DialogInspector } from '../dialog-inspector';
import { Note } from '../_models/note.model';
import { ResponseNotes } from '../_models/response-notes.model';
import { NotesService } from '../_services/notes.service';
import { RouterService } from '../_services/router.service';

@Component({
  selector: 'app-notes-best',
  templateUrl: './notes-best.component.html',
  styleUrls: ['./notes-best.component.scss']
})
export class NotesBestComponent extends DialogInspector implements OnInit, OnDestroy {

  bestNotes!: Note[];
  isLoadingSpinnerVisible: boolean = true;
  destroyComponent$!: Subject<boolean>;

  constructor(
    private router: Router, 
    private routerService: RouterService,
    protected override alertService: AlertService,
    private notesService: NotesService,
  ) {
    super(alertService);
  }

  ngOnInit(): void {
    this.destroyComponent$ = new Subject<boolean>();
    this.routerService.setActualRouteUrl(this.router.url);
    this.getBestNotes();
    this.checkDialogOpeningStatus(this.destroyComponent$);
  }

  getBestNotes(): void {
    this.notesService.getBestNotes()
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

  ngOnDestroy(): void {
    this.destroyComponent$.next(true);
  }
}
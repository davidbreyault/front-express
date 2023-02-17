import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, take, takeWhile, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { Note } from '../_models/note.model';
import { ResponseNotes } from '../_models/response-notes.model';
import { NotesService } from '../_services/notes.service';
import { RouterService } from '../_services/router.service';

@Component({
  selector: 'app-notes-best',
  templateUrl: './notes-best.component.html',
  styleUrls: ['./notes-best.component.scss']
})
export class NotesBestComponent implements OnInit, OnDestroy {

  bestNotes!: Note[];
  isLoadingSpinnerVisible: boolean = true;
  isAnyDialogOpenned: boolean = false;
  isComponentAlive: boolean = true;

  constructor(
    private router: Router, 
    private routerService: RouterService,
    private alertService: AlertService,
    private notesService: NotesService,
  ) {}

  ngOnInit(): void {
    this.routerService.setActualRouteUrl(this.router.url);
    this.getBestNotes();
    this.checkDialogOpeningStatus();
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

  private checkDialogOpeningStatus(): void {
    this.alertService.isAnyDialogOpenedSubject
      .pipe(
        takeWhile(() => this.isComponentAlive), 
        tap(boolean => {
          console.log('Any dialog openned : ' + boolean);
          this.isAnyDialogOpenned = boolean;
        })
      ).subscribe();
  }

  ngOnDestroy(): void {
    this.isComponentAlive = false;
  }
}
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, take, tap, throwError } from 'rxjs';
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
export class NotesBestComponent implements OnInit {

  bestNotes!: Note[];

  constructor(
    private router: Router, 
    private routerService: RouterService,
    private alertService: AlertService,
    private notesService: NotesService,
  ) {}

  ngOnInit(): void {
    this.routerService.setActualRouteUrl(this.router.url);
    this.getBestNotes();
  }

  getBestNotes(): void {
    this.notesService.getBestNotes()
      .pipe(
        take(1),
        tap((response: ResponseNotes) => this.bestNotes = response.notes),
        catchError((httpErrorResponse: HttpErrorResponse) => {
          console.log(httpErrorResponse);
          const message = httpErrorResponse.error ? httpErrorResponse.error : 'An error occured...';
          this.alertService.addAlert(message, AlertType.error);
          return throwError(() => httpErrorResponse);
        })
      ).subscribe()
  }
}
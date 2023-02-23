import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { catchError, interval, Subject, take, takeUntil, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { DialogInspector } from '../dialog-inspector';
import { Note } from '../_models/note.model';
import { ResponseNotes } from '../_models/response-notes.model';
import { NotesService } from '../_services/notes.service';
import { RouterService } from '../_services/router.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent extends DialogInspector implements OnInit, OnDestroy {

  ts: number = 0;
  notes!: Note[];
  pagedNotes!: Note[];
  isLoadingSpinnerVisible: boolean = true;
  destroyComponent$!: Subject<boolean>;
  paginatorData: PageEvent = new PageEvent();

  constructor(
    private notesService: NotesService, 
    private router: Router, 
    private routerService: RouterService,
    protected override alertService: AlertService) 
  {
    super(alertService);
  }

  ngOnInit(): void {
    this.destroyComponent$ = new Subject<boolean>();
    this.routerService.setActualRouteUrl(this.router.url);
    this.getNotes();
    this.updateNotesList();
    this.updateNotesListAfterEvent();
    this.checkDialogOpeningStatus(this.destroyComponent$);
  }

  private getNotes(): void {
    this.notesService.getAllNotes()
      .pipe(
        take(1),
        tap((response: ResponseNotes) => {
          // Si this.notes est vide
          if (!this.notes) {
            // Récupère toutes les notes
            this.notes = response.notes.sort((a: Note, b: Note) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setTimeout(() => {
              this.initPaginatorData(this.notes);
              this.isLoadingSpinnerVisible = false;
            }, 200);
          }
          // Si this.notes n'est pas vide
          if (this.notes && this.notes.length > 0) {
            // Si response.notes a une taille supérieur à this notes
            if (response.notes.length > this.notes.length) {
              // Récupère seulement les notes manquante pour mettre à jour this.notes
              let lastNotes: Note[] = response.notes
              .filter(n => new Date(n.createdAt).getTime() > this.ts)
              .sort((a: Note, b: Note) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
              // Ajout des dernières notes
              lastNotes.forEach(note => this.notes.unshift(note));
            }
          }
          // Mise à jour du timestamp
          this.ts = response.ts;
        }),
        catchError((httpErrorResponse: HttpErrorResponse) => {
          const message = httpErrorResponse.error ? httpErrorResponse.error : 'An error occured, cannot get notes...';
          setTimeout(() => {
            this.isLoadingSpinnerVisible = false;
            this.alertService.addAlert(message, AlertType.error, false);
          }, 1500);
          return throwError(() => httpErrorResponse);
        }))
      .subscribe();
  }

  /**
   * Mise à jour de la liste des notes toutes les 10 secondes
   */
  private updateNotesList(): void {
    interval(10000)
      .pipe(
        takeUntil(this.destroyComponent$), 
        tap(() => this.getNotes()))
      .subscribe();
  }

  /**
   * Mise à jour instantanée de la liste des notes à partir d'un évènement particulier
   * (refreshSubject lance une nouvelle émission à chaque nouvelle publication de note)
   */
  private updateNotesListAfterEvent(): void {
    this.notesService.getRefreshSubject()
      .pipe(
        takeUntil(this.destroyComponent$),
        tap(() => this.getNotes()))
      .subscribe();
  }

  private initPaginatorData(notes: Note[]): void {
    this.paginatorData.pageIndex = 0;
    this.paginatorData.previousPageIndex = 0;
    this.paginatorData.pageSize = 10;
    this.paginatorData.length = notes?.length;
    this.pagedNotes = notes.slice(this.paginatorData.pageIndex, this.paginatorData.pageSize);
  }

  handlePageEvent(event: PageEvent) {
    let indexStart = event.pageSize * event.pageIndex;
    let indexEnd = (event.pageSize * event.pageIndex) + event.pageSize;
    this.pagedNotes = this.notes.slice(indexStart, indexEnd);
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

  ngOnDestroy(): void {
    this.destroyComponent$.next(true);
  }
}
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { catchError, interval, Subject, take, takeUntil, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { PagingData } from 'src/app/shared/_models/paging-data.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { DialogInspector } from '../dialog-inspector';
import { Note } from '../_models/note.model';
import { ResponseNotes } from '../_models/response-notes.model';
import { NotesService } from '../_services/notes.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent extends DialogInspector implements OnInit, OnDestroy {

  notes!: Note[];
  isLoadingSpinnerVisible: boolean = true;
  destroyComponent$!: Subject<boolean>;
  pagingData!: PagingData;

  constructor(
    private notesService: NotesService,
    protected override alertService: AlertService) 
  {
    super(alertService);
  }

  ngOnInit(): void {
    this.initPagingData();
    this.destroyComponent$ = new Subject<boolean>();
    this.getNotes(this.pagingData.pageNumber, this.pagingData.pageSize);
    this.updateNotesList();
    this.updateNotesListAfterEvent();
    this.checkDialogOpeningStatus(this.destroyComponent$);
  }

  private getNotes(pageNumber: number, pageSize: number): void {
    this.notesService.getAllNotes(pageNumber, pageSize)
      .pipe(
        take(1),
        tap((response: ResponseNotes) => {
          this.notes = response.notes;
          this.pagingData.totalItems = response.totalItems;
          this.pagingData.totalPages = response.totalPages;
          this.isLoadingSpinnerVisible = false;
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
        tap(() => this.getNotes(this.pagingData.pageNumber, this.pagingData.pageSize)))
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
        tap(() => this.getNotes(this.pagingData.pageNumber, this.pagingData.pageSize)))
      .subscribe();
  }

  private initPagingData(): void {
    this.pagingData = new PagingData();
    this.pagingData.pageNumber = 0;
    this.pagingData.pageSize = 10;
  }

  handlePageEvent(event: PageEvent) {
    this.pagingData.pageSize = event.pageSize;
    this.pagingData.pageNumber = event.pageIndex;
    this.getNotes(this.pagingData.pageNumber, this.pagingData.pageSize);
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

  updateNotesListAfterDeletion(note: Note) {
    this.notes = this.notes.filter(n => n.id !== note.id);
  }

  ngOnDestroy(): void {
    this.destroyComponent$.next(true);
  }
}
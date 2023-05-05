import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, catchError, interval, Observable, Subject, take, takeUntil, takeWhile, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { PagingData } from 'src/app/shared/_models/paging-data.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { DialogInspector } from '../dialog-inspector';
import { Note } from '../_models/note.model';
import { ResponseNotes } from '../_models/response-notes.model';
import { NotesService } from '../_services/notes.service';
import { SortingData } from 'src/app/shared/_models/sorting-data.model';
import { NoteSearchingData } from 'src/app/shared/_models/note-searching-data.model';

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
  sortingData!: SortingData;
  searchingData!: NoteSearchingData;
  isSortingProcess!: boolean;
  isSortingProcess$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isSearchingProcess!: boolean;
  isSearchingProcess$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  panelOpenState: boolean = false;
  @ViewChild('paginator') paginator!: MatPaginator;

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
    this.updateNotesListAfterEvent();
    this.checkDialogOpeningStatus(this.destroyComponent$);
    this.watchNotesSortingProcess();
    this.watchNotesSearchingProcess();
  }

  private getIsSortingProcess(): Observable<boolean> {
    return this.isSortingProcess$.asObservable();
  }

  private getIsSearchingProcess(): Observable<boolean> {
    return this.isSearchingProcess$.asObservable();
  }

  private getNotes(pageNumber: number, pageSize: number, searchingParams?: NoteSearchingData, sortParams?: SortingData): void {
    console.log('GET NOTES');
    this.notesService.getAllNotes(pageNumber, pageSize, searchingParams, sortParams)
      .pipe(
        take(1),
        tap((response: ResponseNotes) => {
          this.notes = response.notes;
          this.pagingData.totalItems = response.totalItems;
          this.pagingData.totalPages = response.totalPages;
          this.isLoadingSpinnerVisible = false;
          if (this.notes.length === 0) {
            this.alertService.addAlert('No notes has been found with these criteria.', AlertType.error, false);
          }
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
        takeWhile(() => !this.isSortingProcess),
        takeWhile(() => !this.isSearchingProcess),
        tap(() => {
          console.log('UPDATE NOTES (watch new note appearance)');
          this.getNotes(this.pagingData.pageNumber, this.pagingData.pageSize);
        }))
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
    this.getNotes(this.pagingData.pageNumber, this.pagingData.pageSize, this.searchingData, this.sortingData);
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

  updateNotesListAfterDeletion(note: Note) {
    this.notes = this.notes.filter(n => n.id !== note.id);
  }

  filterNotesBySearching(noteSearchingData: NoteSearchingData): void {
    this.searchingData = noteSearchingData;
    // Pour chaque nouvelle recherche, retourne à la première page
    this.paginator.firstPage();
    this.alertService.clearErrorAlerts();
    if (noteSearchingData) {
      const {username, noteKeyword, dateStart, dateEnd} = noteSearchingData;
      if (username || noteKeyword || dateStart || dateEnd) {
        this.isSearchingProcess$.next(true);
        this.getNotes(this.pagingData.pageNumber, this.pagingData.pageSize, this.searchingData);
      } else {
        this.isSearchingProcess$.next(false);
        this.getNotes(this.pagingData.pageNumber, this.pagingData.pageSize);
      }
    }
  }

  sortNotes(sortingData: SortingData) {
    this.sortingData = sortingData;
    sortingData.field && sortingData.direction 
      ? this.isSortingProcess$.next(true)
      : this.isSortingProcess$.next(false);
    this.getNotes(this.pagingData.pageNumber, this.pagingData.pageSize, this.searchingData, this.sortingData);
  }

  private watchNotesSortingProcess(): void {
    this.getIsSortingProcess()
      .pipe(
        takeUntil(this.destroyComponent$),
        tap(data => {
          this.isSortingProcess = data;
          // Si aucune opération de tri n'est en cours, continu d'observer l'apparission de nouvelles notes
          if (!this.isSortingProcess) {
            this.updateNotesList();
          }
        }))
      .subscribe();
  }

  private watchNotesSearchingProcess(): void {
    this.getIsSearchingProcess()
      .pipe(
        takeUntil(this.destroyComponent$),
        tap(data => {
          this.isSearchingProcess = data;
          // Si aucune recherche n'est en cours, continu d'observer l'apparission de nouvelles notes
          if (!this.isSearchingProcess) {
            this.updateNotesList();
          }
        }))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroyComponent$.next(true);
  }
}
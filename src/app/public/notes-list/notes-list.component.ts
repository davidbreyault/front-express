import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, catchError, interval, Observable, Subject, take, takeUntil, takeWhile, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { PagingData } from 'src/app/shared/_models/paging-data.model';
import { SearchingData } from 'src/app/shared/_models/searching-data.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { DialogInspector } from '../dialog-inspector';
import { Note } from '../_models/note.model';
import { ResponseNotes } from '../_models/response-notes.model';
import { NotesService } from '../_services/notes.service';
import { SortingData } from 'src/app/shared/_models/sorting-data.model';

interface Chip {
  label: string,
  name: string,
  isSelected: boolean,
  isAscendingSorted: boolean,
  isDescendingSorted: boolean
}

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
  searchingData!: SearchingData;
  isSortingProcess!: boolean;
  isSortingProcess$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isSearchingProcess!: boolean;
  isSearchingProcess$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  chips!: Chip[];
  previousSelectedChip!: Chip;

  constructor(
    private notesService: NotesService,
    protected override alertService: AlertService) 
  {
    super(alertService);
  }

  ngOnInit(): void {
    this.initChips();
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

  private getNotes(pageNumber: number, pageSize: number, searchingParams?: SearchingData, sortParams?: SortingData): void {
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
            if (searchingParams?.searchingType === 'username') {
              this.alertService.addAlert(searchingParams.searchingTerm + ' has not posted note yet.', AlertType.error, false);
            }
            if (searchingParams?.searchingType === 'keyword') {
              this.alertService.addAlert('No note contain this term.', AlertType.error, false);
            }
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
    interval(8000)
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

  filterNotes(searchingData: SearchingData): void {
    this.searchingData = searchingData;
    this.alertService.clearErrorAlerts();
    if (searchingData.searchingTerm === '') {
      this.isSearchingProcess$.next(false);
      this.getNotes(this.pagingData.pageNumber, this.pagingData.pageSize);
    } else {
      this.isSearchingProcess$.next(true);
      this.getNotes(this.pagingData.pageNumber, this.pagingData.pageSize, this.searchingData);
    }
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
  
  // onClickChip(clickedLabel: string): void {
  //   this.isSortingProcess$.next(true);
  //   // Récupération du chip sur lequel on a cliqué
  //   let chip = this.chips.find(c => c.label === clickedLabel)!
  //   // Si un chip a déjà été sélectionné auparavant 
  //   if (this.previousSelectedChip) {
  //     if (this.previousSelectedChip.label !== clickedLabel) {
  //       this.chips.forEach(c => {
  //         c.isSelected = false;
  //         c.isAscendingSorted = false;
  //       });
  //       chip.isSelected = true;
  //       chip.isAscendingSorted = true;
  //       chip.isDescendingSorted = false;
  //       this.chips.forEach(c => c.previousLabel = this.previousSelectedChip.label);
  //       this.previousSelectedChip = this.chips.find(c => c.label === clickedLabel)!;
  //       this.sortingData = {field: chip.name, direction: 'asc'};
  //       this.getNotes(this.pagingData.pageNumber, this.pagingData.pageSize, this.searchingData, this.sortingData);
  //     } else {
  //       chip.isSelected = true;
  //       chip.isAscendingSorted = !this.previousSelectedChip.isAscendingSorted;
  //       chip.isDescendingSorted = !this.previousSelectedChip.isDescendingSorted;
  //       this.chips.forEach(c => c.previousLabel = this.previousSelectedChip.label);
  //       const direction = chip.isDescendingSorted ? 'desc' : 'asc';
  //       this.sortingData = {field: chip.name, direction: direction};
  //       this.getNotes(this.pagingData.pageNumber, this.pagingData.pageSize, this.searchingData, this.sortingData);
  //     }
  //   }
  //   // Si aucun chip n'a déjà été sélectionné auparavant
  //   if (!this.previousSelectedChip) {
  //     chip.isSelected = true;
  //     chip.isAscendingSorted = true;
  //     this.previousSelectedChip = chip;
  //     this.sortingData = {field: chip.name, direction: 'asc'};
  //     this.getNotes(this.pagingData.pageNumber, this.pagingData.pageSize, this.searchingData, this.sortingData);
  //   }
  // }

  onClickChip(currentSelectedChip: Chip): void {
    this.isSortingProcess$.next(true);
    // Récupération du chip sur lequel on a cliqué
    let chip = this.chips.find(c => c.label === currentSelectedChip.label)!
    // Si un chip a déjà été sélectionné auparavant 
    if (this.previousSelectedChip) {
      if (this.previousSelectedChip.label !== currentSelectedChip.label) {
        this.resetChips();
        this.firstClickSortingChip(chip);
        this.sortingData = {field: chip.name, direction: 'asc'};
        this.previousSelectedChip = chip;
      } else {
        this.secondClickSortingChip(chip);
        this.sortingData = {field: chip.name, direction: chip.isDescendingSorted ? 'desc' : 'asc'};
      }
    }
    // Si aucun chip n'a déjà été sélectionné auparavant
    if (!this.previousSelectedChip) {
      this.firstClickSortingChip(chip);
      this.sortingData = {field: chip.name, direction: 'asc'};
      this.previousSelectedChip = chip;
    }
    this.getNotes(this.pagingData.pageNumber, this.pagingData.pageSize, this.searchingData, this.sortingData);
  }

  private firstClickSortingChip(chip: Chip): void {
    chip.isSelected = true;
    chip.isAscendingSorted = true;
    chip.isDescendingSorted = false;
  }

  private secondClickSortingChip(chip: Chip): void {
    chip.isSelected = true;
    chip.isAscendingSorted = !this.previousSelectedChip.isAscendingSorted;
    chip.isDescendingSorted = !this.previousSelectedChip.isDescendingSorted;
  }

  private initChips(): void {
    this.chips = [
      {label: 'Username', name: 'user.username', isSelected: false, isAscendingSorted: false, isDescendingSorted: false},
      {label: 'Note', name: 'note', isSelected: false, isAscendingSorted: false, isDescendingSorted: false},
      {label: 'Creation Date', name: 'createdAt', isSelected: false, isAscendingSorted: false, isDescendingSorted: false},
      {label: 'Like', name: 'likes', isSelected: false, isAscendingSorted: false, isDescendingSorted: false},
      {label: 'Dislike', name: 'dislikes', isSelected: false, isAscendingSorted: false, isDescendingSorted: false},
    ];
  }

  private resetChips(): void {
    this.chips.forEach(c => {
      c.isSelected = false;
      c.isAscendingSorted = false;
    });
  }

  resetSorting(): void {
    this.initChips();
    this.isSortingProcess$.next(false);
    this.getNotes(this.pagingData.pageNumber, this.pagingData.pageSize, this.searchingData);
  }

  ngOnDestroy(): void {
    this.destroyComponent$.next(true);
  }
}
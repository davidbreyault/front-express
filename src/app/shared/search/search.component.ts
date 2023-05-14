import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { NoteSearchingData } from '../_models/note-searching-data.model';
import { tap } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Output() searchEvent: EventEmitter<NoteSearchingData> = new EventEmitter<NoteSearchingData>();
  searchForm!: FormGroup;
  isResetFormButtonVisible!: boolean;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.isResetFormButtonVisible = false;
    this.toggleResetFormButtonVisibility();
  }

  private initSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      username: [null],
      noteKeyword: [null],
      dateStart: [null],
      dateEnd: [null]
    });
  }

  onClickSearch(): void {
    this.searchEvent.emit(this.searchForm.value);
  }

  onClickReset(): void {
    this.searchForm.reset();
    this.searchEvent.emit(this.searchForm.value);
  }

  toggleResetFormButtonVisibility(): void {
    this.searchForm.valueChanges
      .pipe(tap(values => this.isResetFormButtonVisible = !Object.entries(values).every(item => (item[1] === null || item[1] === ''))))
      .subscribe();
  }
}
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchingData } from '../_models/searching-data.model';

interface SelectValues {
  name: string,
  value: string
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Output() searchEvent: EventEmitter<SearchingData> = new EventEmitter<SearchingData>();
  searchForm!: FormGroup;
  selectTypes: SelectValues[] = [
    {name: 'Keyword', value: 'keyword'},
    {name: 'Publication date', value: 'createdAt'},
    {name: 'Username', value: 'username'}
  ];
  selectTypeDefault = this.selectTypes[2].value;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initSearchForm();
  }

  private initSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      searchingTerm: [null],
      searchingType: [null, Validators.required]
    });
  }

  onClickSearch(): void {
    this.searchEvent.emit(this.searchForm.value);
  }
}

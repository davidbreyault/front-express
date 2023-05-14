import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SortingData } from '../_models/sorting-data.model';

interface Chip {
  label: string,
  name: string,
  isSelected: boolean,
  isAscendingSorted: boolean,
  isDescendingSorted: boolean
}

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})
export class SortComponent implements OnInit {

  chips!: Chip[];
  previousSelectedChip!: Chip;
  sortingData!: SortingData;
  @Output() sortingEvent: EventEmitter<SortingData> = new EventEmitter<SortingData>();

  constructor() { }

  ngOnInit(): void {
    this.initChips();
  }

  onClickChip(currentSelectedChip: Chip): void {
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
    this.sortingEvent.emit(this.sortingData);
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
    this.sortingData.field = null;
    this.sortingData.direction = null;
    this.sortingEvent.emit(this.sortingData);
  }
}

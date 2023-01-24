import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Note } from '../_models/note.model';
import { ResponseNotes } from '../_models/response-notes.model';
import { NotesService } from '../_services/notes.service';
import { RouterService } from '../_services/router.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent implements OnInit {

  notes!: Note[];
  isLoadingWheelVisible: boolean = true;

  constructor(private notesService: NotesService, private router: Router, private routerService: RouterService) { }

  ngOnInit(): void {
    this.routerService.setActualRouteUrl(this.router.url)
    this.notesService.getAllNotes().subscribe(
      (response: ResponseNotes) => {
        this.notes = response.notes;
        this.isLoadingWheelVisible = false;
      }
    )
  }
}
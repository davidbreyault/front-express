import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil, tap } from 'rxjs';
import { Note } from '../_models/note.model';
import { ResponseNotes } from '../_models/response-notes.model';
import { NotesService } from '../_services/notes.service';
import { RouterService } from '../_services/router.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent implements OnInit, OnDestroy {

  notes!: Note[];
  isLoadingWheelVisible: boolean = true;
  subscription: Subscription = new Subscription;

  constructor(
    private notesService: NotesService, 
    private router: Router, 
    private routerService: RouterService) { }

  ngOnInit(): void {
    this.routerService.setActualRouteUrl(this.router.url)
    this.subscription = this.notesService.getAllNotes()
      .pipe(
        tap((response: ResponseNotes) => {
          this.notes = response.notes;
          this.isLoadingWheelVisible = false;
        })
      ).subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
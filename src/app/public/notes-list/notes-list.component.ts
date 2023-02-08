import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, take, takeWhile, tap } from 'rxjs';
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

  ts: number = 0;
  notes!: Note[];
  isAlive: boolean = true;
  isLoadingWheelVisible: boolean = true;

  constructor(
    private notesService: NotesService, 
    private router: Router, 
    private routerService: RouterService) { }

  ngOnInit(): void {
    this.routerService.setActualRouteUrl(this.router.url)
    this.getNotes();
    this.updateNotesList();
    this.updateNotesListAfterEvent(); 
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
          }
          // Si this.notes n'est pas vide
          if (this.notes && this.notes.length > 0) {
            // Si response.notes a une taille supérieur à this notes
            if (response.notes.length > this.notes.length) {
              console.log(this.ts)
              console.log(response.ts)
              // Récupère seulement les notes manquante pour mettre à jour this.notes
              let lastNotes: Note[] = response.notes
              .filter(n => new Date(n.createdAt).getTime() > this.ts)
              .sort((a: Note, b: Note) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
              console.log(lastNotes);
              lastNotes.forEach(note => this.notes.unshift(note));
            }
          }
          // Mise à jour du timestamp
          this.ts = response.ts;
          this.isLoadingWheelVisible = false;
        })
      ).subscribe();
  }

  /**
   * Mise à jour de la liste des notes toutes les 10 secondes
   */
  private updateNotesList(): void {
    interval(10000)
      .pipe(
        takeWhile(() => this.isAlive), 
        tap(() => this.getNotes())
      ).subscribe();
  }

  /**
   * Mise à jour instantanée de la liste des notes à partir d'un évènement particulier
   */
  private updateNotesListAfterEvent(): void {
    // refreshSubject émet à chaque publication d'une nouvelle note
    this.notesService.getRefreshSubject()
      .pipe(
        takeWhile(() => this.isAlive),
        tap(() => this.getNotes())
      ).subscribe();
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
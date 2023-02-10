import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { take, tap } from 'rxjs';
import { CommentsLayoutComponent } from '../comments-layout/comments-layout.component';
import { Note } from '../_models/note.model';
import { ResponseSuccess } from '../_models/response-success.model';
import { NotesService } from '../_services/notes.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {

  @Input() note!: Note;
  commentsDialogConfig!: MatDialogConfig;

  constructor(
    private notesService: NotesService,
    private commentDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initCommentsDialogConfig();
  }

  onClickLike(): void {
    this.notesService.likeNote(this.note.id)
      .pipe(
        take(1),
        tap((response: HttpResponse<ResponseSuccess>) => {
          if (response.status === 200) {
            this.note.likes++;
          }
        })
      )
      .subscribe();
  }

  onClickDislike(): void {
    this.notesService.dislikeNote(this.note.id)
      .pipe(
        take(1),
        tap((response: HttpResponse<ResponseSuccess>) => {
          if (response.status === 200) {
            this.note.dislikes++;
          }
        })
      )
      .subscribe();
  }

  private initCommentsDialogConfig(): void {
    this.commentsDialogConfig = {
      minWidth: "450px"
    }
  }

  onClickComment(): void {
    const commentDialog = this.commentDialog.open(CommentsLayoutComponent, this.commentsDialogConfig);
  }
}

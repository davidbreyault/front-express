import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { take, tap } from 'rxjs';
import { CommentsLayoutComponent } from '../comments-layout/comments-layout.component';
import { Note } from '../_models/note.model';
import { ResponseSuccess } from '../_models/response-success.model';
import { CommentsService } from '../_services/comments.service';
import { NotesService } from '../_services/notes.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {

  @Input() note!: Note;
  @Input() showCommentButton!: boolean;
  commentsDialogConfig!: MatDialogConfig;
  hideCommentButton: boolean = false;

  constructor(
    private notesService: NotesService,
    private commentsService: CommentsService,
    private commentDialog: MatDialog,
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
      minWidth: '500px',
      maxWidth: '600px',
      maxHeight: '85vh',
      data: {
        note: null,
        comments: null
      }
    }
  }

  onClickComment(): void {
    this.commentsDialogConfig.data.note = this.note;
    if (this.note.comments > 0) {
      this.commentsService.getNoteComments(this.note.id)
        .pipe(
          take(1),
          tap(response => this.commentsDialogConfig.data.comments = response['comments'])
        ).subscribe();
    }
    this.commentDialog.open(CommentsLayoutComponent, this.commentsDialogConfig);
  }
}

import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { take, tap } from 'rxjs';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { TokenService } from 'src/app/shared/_services/token.service';
import { Affiliations } from '../affiliations';
import { CommentsLayoutComponent } from '../comments-layout/comments-layout.component';
import { Note } from '../_models/note.model';
import { ResponseSuccess } from '../_models/response-success.model';
import { AuthenticationService } from '../_services/authentication.service';
import { NotesService } from '../_services/notes.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent extends Affiliations implements OnInit {

  @Input() note!: Note;
  @Input() showCommentButton!: boolean;
  @Input() showActionButtons!: boolean;
  commentsDialogConfig!: MatDialogConfig;

  constructor(
    private notesService: NotesService,
    private commentDialog: MatDialog,
    private alertService: AlertService,
    protected override tokenService: TokenService,
    protected override authenticationService: AuthenticationService
  ) {
    super(tokenService, authenticationService);
  }

  ngOnInit(): void {
    this.initCommentsDialogConfig();
    this.isPostedByLoggedUser(this.note);
  }

  private initCommentsDialogConfig(): void {
    this.commentsDialogConfig = {
      minWidth: '500px',
      maxWidth: '600px',
      maxHeight: '85vh',
      data: this.note
    }
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

  onClickComment(): void {
    const commentDialog = this.commentDialog.open(CommentsLayoutComponent, this.commentsDialogConfig);
    this.alertService.noticeDialogOpenning();
    commentDialog.afterClosed()
      .pipe(take(1), tap((updatedCommentsNumber: number) => {
        this.alertService.noticeDialogClosing();
        if (updatedCommentsNumber) {
          this.note.comments = updatedCommentsNumber;
        }
      }))
      .subscribe();
  }

  isPopular(): boolean {
    return this.note.likes >= 50;
  }
}
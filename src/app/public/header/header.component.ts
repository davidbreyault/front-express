import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { take, tap } from 'rxjs';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { AuthenticationComponent } from '../authentication/authentication.component';
import { NotePostComponent } from '../note-post/note-post.component';
import { Authentication } from '../_models/authentication.model';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() authentication!: Authentication;
  matDialogConfig!: MatDialogConfig;

  constructor(
    public notePostDialog: MatDialog,
    public authenticationDialog: MatDialog,
    private alertService: AlertService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.initDialogConfig();
  }

  initDialogConfig(): void {
    this.matDialogConfig = {
      minWidth: "450px",
      data: {
        isPosted: true,
        isUpdated: false
      }
    }
  }

  onClickAuthenticationDialog(): void {
    const authDialog = this.authenticationDialog.open(AuthenticationComponent, this.matDialogConfig);
    this.alertService.noticeDialogOpenning();
    authDialog.afterClosed()
      .pipe(take(1), tap(() => this.alertService.noticeDialogClosing()))
      .subscribe();
  }

  onClickNotePostDialog(): void {
    const postDialog = this.notePostDialog.open(NotePostComponent, this.matDialogConfig);
    this.alertService.noticeDialogOpenning();
    postDialog.afterClosed()
      .pipe(take(1), tap(() => this.alertService.noticeDialogClosing()))
      .subscribe();
  }

  onClickLogOut(): void {
    this.authenticationService.logOut();
  }
}
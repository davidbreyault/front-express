import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthenticationComponent } from '../authentication/authentication.component';
import { Authentication } from '../_models/authentication.model';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() authentication!: Authentication;

  constructor(
    public authDialog: MatDialog,
    private authenticationService: AuthenticationService
  ) {}

  onOpenAuthenticationDialog(): void {
    const matDialogConfig: MatDialogConfig = {
      minWidth: "450px"
    }
    this.authDialog.open(AuthenticationComponent, matDialogConfig);
  }

  onClickLogOut(): void {
    this.authenticationService.logOut();
  }
}

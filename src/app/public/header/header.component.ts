import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthenticationComponent } from '../authentication/authentication.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public authDialog: MatDialog) { }

  ngOnInit(): void {
  }

  onOpenAuthenticationDialog(): void {
    const matDialogConfig: MatDialogConfig = {
      minWidth: "450px"
    }
    this.authDialog.open(AuthenticationComponent, matDialogConfig);
  }
}

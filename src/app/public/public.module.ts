import { NgModule } from '@angular/core';
import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/shared.module';
import { NotesService } from './_services/notes.service';
import { NoteComponent } from './note/note.component';
import { NotesLayoutComponent } from './notes-layout/notes-layout.component';
import { NotesListComponent } from './notes-list/notes-list.component';
import { BannerComponent } from './banner/banner.component';
import { BannerDirective } from './_directives/banner.directive';
import { SidenavComponent } from './sidenav/sidenav.component';
import { RouterService } from './_services/router.service';
import { NotesBestComponent } from './notes-best/notes-best.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { RegistrationComponent } from './registration/registration.component';
import { RegistrationService } from './_services/registration.service';
import { AuthenticationService } from './_services/authentication.service';
import { BasicAuthenticationService } from './_services/basic-authentication.service';
import { NotePostComponent } from './note-post/note-post.component';


@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    BannerComponent,
    NotesLayoutComponent,
    NotesListComponent,
    NoteComponent,
    SidenavComponent,
    NotesBestComponent,
    AuthenticationComponent,
    RegistrationComponent,
    NotePostComponent,
    BannerDirective
  ],
  imports: [
    SharedModule,
    PublicRoutingModule
  ],
  exports: [
    HeaderComponent,
    BannerComponent,
    SidenavComponent
  ],
  providers: [
    NotesService,
    RouterService,
    RegistrationService,
    AuthenticationService,
    BasicAuthenticationService
  ]
})
export class PublicModule { }

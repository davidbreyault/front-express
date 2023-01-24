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


@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    BannerComponent,
    NotesLayoutComponent,
    NotesListComponent,
    NoteComponent,
    SidenavComponent,
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
    RouterService
  ]
})
export class PublicModule { }

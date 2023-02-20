// Modules
import { NgModule } from '@angular/core';
import { PublicRoutingModule } from './public-routing.module';
import { SharedModule } from '../shared/shared.module';
// Components
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { NoteComponent } from './note/note.component';
import { NotesLayoutComponent } from './notes-layout/notes-layout.component';
import { NotesListComponent } from './notes-list/notes-list.component';
import { BannerComponent } from './banner/banner.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { NotesBestComponent } from './notes-best/notes-best.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { RegistrationComponent } from './registration/registration.component';
import { NotePostComponent } from './note-post/note-post.component';
import { CommentsLayoutComponent } from './comments-layout/comments-layout.component';
import { CommentComponent } from './comment/comment.component';
import { CommentPostComponent } from './comment-post/comment-post.component';
import { TrendingComponent } from './trending/trending.component';
// Services
import { RouterService } from './_services/router.service';
import { RegistrationService } from './_services/registration.service';
import { AuthenticationService } from './_services/authentication.service';
import { BasicAuthenticationService } from './_services/basic-authentication.service';
import { NotesService } from './_services/notes.service';
import { CommentsService } from './_services/comments.service';
import { TrendingService } from './_services/trending.service';
// Directives
import { BannerDirective } from './_directives/banner.directive';
import { TalkersListComponent } from './talkers-list/talkers-list.component';
import { TalkersService } from './_services/talkers.service';
import { TalkerComponent } from './talker/talker.component';

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
    CommentsLayoutComponent,
    CommentComponent,
    BannerDirective,
    CommentPostComponent,
    TrendingComponent,
    TalkersListComponent,
    TalkerComponent,
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
    CommentsService,
    TrendingService,
    TalkersService,
    RegistrationService,
    AuthenticationService,
    BasicAuthenticationService
  ]
})
export class PublicModule { }

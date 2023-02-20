import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotesBestComponent } from './notes-best/notes-best.component';
import { NotesLayoutComponent } from './notes-layout/notes-layout.component';
import { NotesListComponent } from './notes-list/notes-list.component';
import { TalkersListComponent } from './talkers-list/talkers-list.component';
import { TrendingComponent } from './trending/trending.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'talkers', component: TalkersListComponent },
  { path: 'trending', component: TrendingComponent },
  { path: 'notes', component: NotesLayoutComponent, children: 
    [
      { path: 'all', component: NotesListComponent },
      { path: 'best', component: NotesBestComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
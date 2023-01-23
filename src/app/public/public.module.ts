import { NgModule } from '@angular/core';
import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { NotesComponent } from './notes/notes.component';
import { SharedModule } from '../shared/shared.module';
import { BannerComponent } from './banner/banner.component';


@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    NotesComponent,
    BannerComponent
  ],
  imports: [
    SharedModule,
    PublicRoutingModule
  ],
  exports: [
    HeaderComponent
  ]
})
export class PublicModule { }

import { NgModule } from '@angular/core';
import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/shared.module';
import { LayoutNotesComponent } from './layout-notes/layout-notes.component';


@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    LayoutNotesComponent
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

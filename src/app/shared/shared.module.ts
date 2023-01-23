import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module'
import { BannerDirective } from './directives/banner.directive';
import { BannerComponent } from './components/banner/banner.component';



@NgModule({
  declarations: [
    BannerDirective,
    BannerComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    BannerComponent
  ]
})
export class SharedModule { }

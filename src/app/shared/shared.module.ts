import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './_services/interceptor.service';
import { ButtonBurgerComponent } from './button-burger/button-burger.component';



@NgModule({
  declarations: [
    ButtonBurgerComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    ButtonBurgerComponent
  ], 
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ]
})
export class SharedModule { }

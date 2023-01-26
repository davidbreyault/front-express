import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './_services/interceptor.service';
import { ButtonBurgerComponent } from './button-burger/button-burger.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SanitizePipe } from './_pipes/sanitize.pipe';
import { AlertComponent } from './alert/alert.component';
import { AlertService } from './_services/alert.service';



@NgModule({
  declarations: [
    SanitizePipe,
    AlertComponent,
    ButtonBurgerComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    SanitizePipe,
    AlertComponent,
    ButtonBurgerComponent
  ], 
  providers: [
    AlertService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ]
})
export class SharedModule { }

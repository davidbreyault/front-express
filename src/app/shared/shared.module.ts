// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Pipes
import { SanitizePipe } from './_pipes/sanitize.pipe';
// Services
import { AlertService } from './_services/alert.service';
import { TokenService } from './_services/token.service';
import { InterceptorService } from './_services/interceptor.service';
import { ErrorValidatorService } from './_services/error-validator.service';
// Components
import { AlertComponent } from './alert/alert.component';
import { SearchComponent } from './search/search.component';
import { ButtonBurgerComponent } from './button-burger/button-burger.component';
import { SortComponent } from './sort/sort.component';

@NgModule({
  declarations: [
    SanitizePipe,
    AlertComponent,
    SearchComponent,
    ButtonBurgerComponent,
    SortComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SanitizePipe,
    AlertComponent,
    SearchComponent,
    ButtonBurgerComponent,
    SortComponent
  ], 
  providers: [
    TokenService,
    AlertService,
    ErrorValidatorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ]
})
export class SharedModule { }
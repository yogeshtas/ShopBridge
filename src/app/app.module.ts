import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

import { ToastrModule } from 'ngx-toastr';
import { ExcelService } from './core/services/exportExcel.service';
import { UserService } from './core/services/user.service';
import { JsonApiService } from './core/services/json-api.service';
import { NotificationService } from './core/services/notification.service';

import { AuthInterceptorService } from "./core/services/auth-interceptor.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    ToastrModule.forRoot()
  ],
  providers: [ UserService, JsonApiService, NotificationService, AuthInterceptorService,
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }

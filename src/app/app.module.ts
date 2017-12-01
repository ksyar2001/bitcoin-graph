import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppRouting } from './shared/routing/routing';
import { ServerService } from './shared/services/server.service';
import { HttpService } from './shared/services/HttpClient';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AppRouting
  ],
  providers: [HttpService, ServerService],
  bootstrap: [AppComponent]
})
export class AppModule { }

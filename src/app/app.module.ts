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
import { TableComponent} from './table/table.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon'; 
import { CdkTableModule } from '@angular/cdk/table';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AppRouting,
    MatToolbarModule,
    MatIconModule,
    CdkTableModule
  ],
  providers: [HttpService, ServerService],
  bootstrap: [AppComponent]
})
export class AppModule { }

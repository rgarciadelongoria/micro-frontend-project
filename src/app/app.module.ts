import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MicroFrontendModule } from 'micro-frontend';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MicroFrontendModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

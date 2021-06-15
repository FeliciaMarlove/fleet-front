import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './core/header/header.component';
import { SideNavComponent } from './core/side-nav/side-nav.component';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import {DatePipe, DecimalPipe} from '@angular/common';
import {BelgianPhoneNumberPipe} from './shared/pipe/belgian-phone-number.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideNavComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NoopAnimationsModule,
        CoreModule,
        SharedModule,
        MatSidenavModule,
    ],
  providers: [
    DatePipe,
    DecimalPipe,
    BelgianPhoneNumberPipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

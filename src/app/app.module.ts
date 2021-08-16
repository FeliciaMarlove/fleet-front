import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './core/header/header.component';
import {SideNavComponent} from './core/side-nav/side-nav.component';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import {DatePipe, DecimalPipe} from '@angular/common';
import {BelgianPhoneNumberPipe} from './shared/pipe/belgian-phone-number.pipe';
import { FormsModule } from '@angular/forms';
import { IPublicClientApplication,
  PublicClientApplication,
  BrowserCacheLocation } from '@azure/msal-browser';
import { MsalModule,
  MsalService,
  MSAL_INSTANCE } from '@azure/msal-angular';
import { OAuthSettings } from '../oauth';

let msalInstance: IPublicClientApplication | undefined;

export function MSALInstanceFactory(): IPublicClientApplication {
  msalInstance = msalInstance ?? new PublicClientApplication({
    auth: {
      clientId: OAuthSettings.appId,
      redirectUri: OAuthSettings.redirectUri,
      postLogoutRedirectUri: OAuthSettings.redirectUri
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
    }
  });

  return msalInstance;
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideNavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    MatSidenavModule,
    FormsModule,
    MsalModule
  ],
  providers: [
    DatePipe,
    DecimalPipe,
    BelgianPhoneNumberPipe,
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    MsalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import {OAuthSettings} from '../../../oauth';

@Injectable({
  providedIn: 'root'
})

// https://docs.microsoft.com/en-us/graph/tutorials/angular?WT.mc_id=Portal-Microsoft_AAD_RegisteredApps&tutorial-step=3 jusqu'au 6 non inclus

export class AuthService {
  public authenticated: boolean;
  public graphClient?: Client;
  private user: User;

  constructor(
    private msalService: MsalService) {

    this.authenticated = false;
  }

  // Prompt the user to sign in and
  // grant consent to the requested permission scopes
  async signIn(): Promise<void> {
    const result = await this.msalService
      .loginPopup(OAuthSettings)
      .toPromise()
      .catch((reason) => {
        // TODO log
      });

    if (result) {
      this.msalService.instance.setActiveAccount(result.account);
      this.authenticated = true;
      this.user = await this.getUser();
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    await this.msalService.logout().toPromise();
    this.authenticated = false;
  }

  private async getUser(): Promise<User | undefined> {
    if (!this.authenticated) {
      return undefined;
    }

    // Create an authentication provider for the current user
    const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
      this.msalService.instance as PublicClientApplication,
      {
        account: this.msalService.instance.getActiveAccount(),
        scopes: OAuthSettings.scopes,
        interactionType: InteractionType.Popup
      }
    );

    // Initialize the Graph client
    this.graphClient = Client.initWithMiddleware({
      authProvider
    });

    // Get the user from Graph (GET /me)
    const graphUser: MicrosoftGraph.User = await this.graphClient
      .api('/me')
      .select('displayName,mail,mailboxSettings,userPrincipalName')
      .get();

    const user = new User();
    user.displayName = graphUser.displayName ?? '';
    // Prefer the mail property, but fall back to userPrincipalName
    user.email = graphUser.mail ?? graphUser.userPrincipalName ?? '';
    user.timeZone = graphUser.mailboxSettings?.timeZone ?? 'UTC';

    // Use default avatar
    user.avatar = '/assets/no-profile-photo.png';

    return user;
  }
}

class User {
  displayName!: string;
  email!: string;
  avatar!: string;
  timeZone!: string;
}

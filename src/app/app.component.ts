import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'Fleet Management';
  public darkModeUI = true;

  @HostBinding('class')
  get themeMode() {
    return this.darkModeUI ? 'dark-theme' : 'light-theme';
  }
}

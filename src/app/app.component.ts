import {Component, HostBinding, Renderer2} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'Fleet Management';
  public darkModeUI = false;

  constructor(private renderer: Renderer2) {
    this.renderer.addClass(document.body, this.darkModeUI ? 'dark' : 'light');
  }

  @HostBinding('class')
  get themeMode() {
    return this.darkModeUI ? 'dark-theme' : 'light-theme';
  }
}

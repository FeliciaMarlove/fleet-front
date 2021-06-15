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
    this.renderPageBodyColor();
  }

  /**
   * Switch dark/light theme as defined in themes in the styles.scss file and according to value of darkModeUI
   */
  @HostBinding('class')
  get themeMode() {
    return this.darkModeUI ? 'dark-theme' : 'light-theme';
  }

  /**
   * Listen for changes of the toggle state in child component "header"
   * Change the value of darkModeUI accordingly
   * Call page body background color rendering
   * @param $event The boolean emitted by the child component
   */
  public getDarkThemeOn($event) {
    this.darkModeUI = $event;
    this.renderPageBodyColor();
  }

  /**
   * Change the page body background color to match the content background
   * The name of the class is a reference to a CSS class in the styles.scss file
   * For example, 'dark' activates the 'body.dark' CSS class
   * Classes must be explicitly removed before rendering another one
   * @private
   */
  private renderPageBodyColor() {
    this.renderer.removeClass(document.body, 'dark');
    this.renderer.removeClass(document.body, 'light');
    this.renderer.addClass(document.body, this.darkModeUI ? 'dark' : 'light');
  }
}

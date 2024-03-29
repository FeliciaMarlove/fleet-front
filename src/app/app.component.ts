import {Component, HostBinding, HostListener, Renderer2, ViewChild} from '@angular/core';
import {OverlayContainer} from '@angular/cdk/overlay';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'Fleet Management';
  public darkModeUI = false;
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(
    private renderer: Renderer2,
    private overlayContainer: OverlayContainer,
  ) {
    if (localStorage.getItem('theme') === 'dark') {
      this.darkModeUI = true;
    }
    this.renderPageBodyColor();
    this.applyThemeToOverlayContainers();
  }

  /**
   * Listen for window resizing events
   * Close the sidenav if window is under 900 width
   * @param event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 900) {
      this.sidenav.close();
    }
  }

  /**
   * Switch dark/light theme as defined in themes in the styles.scss file and according to value of darkModeUI
   */
  @HostBinding('class')
  public get themeMode() {
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
    if (this.darkModeUI) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.removeItem('theme');
    }
    this.renderPageBodyColor();
    this.applyThemeToOverlayContainers();
  }

  /**
   * Change the page body background color to match the content background
   * The name of the class is a reference to a CSS class in the styles.scss file
   * For example, 'dark' activates the 'body.dark' CSS class
   * Current theme classes must be explicitly removed before assigning another one
   * @private
   */
  private renderPageBodyColor() {
    this.renderer.removeClass(document.body, 'dark');
    this.renderer.removeClass(document.body, 'light');
    this.renderer.addClass(document.body, this.darkModeUI ? 'dark' : 'light');
  }

  /**
   * Propagate dynamic theme change to overly containers (dialogs eg)
   * The name of the class is a reference to a CSS class in the styles.scss file
   * For example, 'dark' activates the 'body.dark' CSS class
   * Current theme classes must be explicitly removed before assigning another one
   * @private
   */
  private applyThemeToOverlayContainers() {
    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
    const classesToRemove = Array.from(overlayContainerClasses).filter(item => item.includes('-theme'));
    overlayContainerClasses.remove(...classesToRemove);
    this.overlayContainer.getContainerElement().classList.add(this.darkModeUI ? 'dark-theme' : 'light-theme');
  }
}

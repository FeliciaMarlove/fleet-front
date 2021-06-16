import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {MatSlideToggle} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() sidenavHandle: MatSidenav;
  public title = 'Fleet Management';
  private darkThemeIcon = 'nightlight_round';
  private lightThemeIcon = 'wb_sunny';
  public lightDarkToggleIcon = this.darkThemeIcon;
  public defaultTheme = true;
  @Output() darkThemeOn: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
    this.checkDefaultTheme();
  }

  ngOnInit() {
  }

  /**
   * Check in localStorage if user chose dark-theme previously
   * If so, initiate the app with the dark-theme (non default)
   * @private
   */
  private checkDefaultTheme() {
    if (localStorage.getItem('theme') === 'dark') {
      this.lightDarkToggleIcon = this.lightThemeIcon;
      this.defaultTheme = false;
    }
  }

  /**
   * Change theme switcher icon to show the icon of the inactive theme (if light theme is on, the icon of dark theme is displayed)
   * Emit value to parent component to adapt theme and styling
   * If defaultTheme:
   * Default position of toggle is "checked" (true) which corresponds to displaying the light theme
   * When toggle position is false, the dark theme must be displayed
   * If !defaultTheme:
   * Behavior is the other way around
   * @param toggle The toggle object from the template
   */
  public doToggleLightDark(toggle: MatSlideToggle) {
    if (this.defaultTheme) {
      this.lightDarkToggleIcon = toggle.checked ? this.darkThemeIcon : this.lightThemeIcon;
      this.darkThemeOn.emit(!toggle.checked);
    } else {
      this.lightDarkToggleIcon = !toggle.checked ? this.darkThemeIcon : this.lightThemeIcon;
      this.darkThemeOn.emit(toggle.checked);
    }
  }
}

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
  @Output() darkThemeOn: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  /**
   * Change theme switcher icon to show the icon of the inactive theme (if light theme is on, the icon of dark theme is displayed)
   * Emit value to parent component to adapt theme and styling
   * Default position of toggle is "checked" (true) which corresponds to displaying the light theme
   * When toggle position is false, the dark theme must be displayed
   * @param toggle The toggle object from the template
   */
  public doToggleLightDark(toggle: MatSlideToggle) {
    console.log(toggle.checked);
    this.lightDarkToggleIcon = toggle.checked ?  this.darkThemeIcon : this.lightThemeIcon;
    this.darkThemeOn.emit(!toggle.checked);
  }
}

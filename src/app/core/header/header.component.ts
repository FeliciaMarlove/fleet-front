import {Component, Input, OnInit} from '@angular/core';
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

  constructor() { }

  ngOnInit() {
  }

  // checked : false = dark bc true = default
  public doToggleLightDark(toggle: MatSlideToggle) {
    console.log('toggle is on position', toggle.checked);
    this.lightDarkToggleIcon = toggle.checked ?  this.darkThemeIcon : this.lightThemeIcon;
  }
}

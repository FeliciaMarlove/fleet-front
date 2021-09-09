import {Component, Input, OnInit} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Title} from '@angular/platform-browser';
import {NavigationEnd, Router} from '@angular/router';

const links = [
  { title: 'Fleet', link: '/fleet' },
  { title: 'Inspections', link: '/inspection' },
  { title: 'Fuel usage', link: '/fillups' },
  { title: 'Staff', link: '/staff' },
  { title: 'Leasing companies', link: '/leasing' },
];

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  public links = links;
  public current: { link: string; title: string };
  @Input() sidenavHandle: MatSidenav;

  constructor(private titleService: Title, private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          this.links.forEach(link => {
            if (link.link === this.router.url) {
              this.current = link;
              this.titleService.setTitle(link.title + ' | Fleet management');
            }
          });
        }
      }
    );
  }

  /**
   * Assign current link to class member "current"
   * @param link The link clicked and currently active
   */
  public onClickAssignCurrent(link: { link: string; title: string }) {
    this.current = link;
    this.titleService.setTitle(link.title + ' | Fleet management');
  }
}

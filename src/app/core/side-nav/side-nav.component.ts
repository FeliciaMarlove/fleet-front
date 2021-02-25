import {Component, Input, OnInit} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  @Input() sidenavHandle: MatSidenav;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

  }

}

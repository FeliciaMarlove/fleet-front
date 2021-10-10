import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {
  }

  /**
   * Return true (allow to activate the route) if a user is logged, otherwise redirect to bootstrap url
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (sessionStorage.getItem('logged')) {
      return true; // la route peut être accédée
    } else {
      return this.router.parseUrl('fleet'); // redirection vers une page qui peut être accédée sans être authentifié
    }
  }
}

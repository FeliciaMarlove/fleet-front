import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StaffListComponent} from './staff-list/staff-list.component';
import {FleetListComponent} from './fleet/fleet-list/fleet-list.component';
import {FillupsListComponent} from './fillups/fillups-list/fillups-list.component';
import {LeasingCompaniesListComponent} from './leasing-companies/leasing-companies-list/leasing-companies-list.component';
import {InspectionsListComponent} from './inspections/inspections-list/inspections-list.component';
import {AuthGuard} from '../core/auth-guard/auth.guard';

const routes: Routes = [
  {path: 'fleet', pathMatch: 'full', component: FleetListComponent},
  {path: '', redirectTo: 'fleet'},
  {path: 'staff', component: StaffListComponent, canActivate: [AuthGuard]},
  {path: 'fillups', component: FillupsListComponent, canActivate: [AuthGuard]},
  {path: 'leasing', component: LeasingCompaniesListComponent, canActivate: [AuthGuard]},
  {path: 'inspection', component: InspectionsListComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FleetManagementRouting {
}

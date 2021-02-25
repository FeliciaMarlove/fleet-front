import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StaffListComponent} from './staff-list/staff-list.component';
import {FleetListComponent} from './fleet/fleet-list/fleet-list.component';
import {FillupsListComponent} from './fillups/fillups-list/fillups-list.component';
import {LeasingCompaniesListComponent} from './leasing-companies/leasing-companies-list/leasing-companies-list.component';
import {InspectionsListComponent} from './inspections/inspections-list/inspections-list.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: FleetListComponent},
  {path: 'staff', component: StaffListComponent},
  {path: 'fillups', component: FillupsListComponent},
  {path: 'leasing', component: LeasingCompaniesListComponent},
  {path: 'inspection', component: InspectionsListComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FleetManagementRouting {
}

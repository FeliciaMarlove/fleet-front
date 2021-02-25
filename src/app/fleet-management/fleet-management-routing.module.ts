import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StaffListComponent} from './staff-list/staff-list.component';
import {FleetListComponent} from './fleet/fleet-list/fleet-list.component';
import {FillupsListComponent} from './fillups/fillups-list/fillups-list.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: FleetListComponent},
  {path: 'staff', component: StaffListComponent},
  {path: 'fillups', component: FillupsListComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FleetManagementRouting {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import { StaffListComponent } from './staff-list/staff-list.component';
import { FleetListComponent } from './fleet/fleet-list/fleet-list.component';
import {FleetManagementRouting} from './fleet-management-routing.module';
import { FillupsListComponent } from './fillups/fillups-list/fillups-list.component';



@NgModule({
  declarations: [
    StaffListComponent,
    FleetListComponent,
    FillupsListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FleetManagementRouting
  ]
})
export class FleetManagementModule { }

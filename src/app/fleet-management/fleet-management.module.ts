import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import { StaffListComponent } from './staff-list/staff-list.component';
import { FleetListComponent } from './fleet/fleet-list/fleet-list.component';
import {FleetManagementRouting} from './fleet-management-routing.module';



@NgModule({
  declarations: [
    StaffListComponent,
    FleetListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FleetManagementRouting
  ]
})
export class FleetManagementModule { }

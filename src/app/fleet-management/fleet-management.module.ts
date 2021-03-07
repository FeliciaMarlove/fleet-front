import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import { StaffListComponent } from './staff-list/staff-list.component';
import { FleetListComponent } from './fleet/fleet-list/fleet-list.component';
import {FleetManagementRouting} from './fleet-management-routing.module';
import { FillupsListComponent } from './fillups/fillups-list/fillups-list.component';
import { LeasingCompaniesListComponent } from './leasing-companies/leasing-companies-list/leasing-companies-list.component';
import { InspectionsListComponent } from './inspections/inspections-list/inspections-list.component';
import { FleetFilterDialogComponent } from './fleet/fleet-list/fleet-filter-dialog/fleet-filter-dialog.component';



@NgModule({
  declarations: [
    StaffListComponent,
    FleetListComponent,
    FillupsListComponent,
    LeasingCompaniesListComponent,
    InspectionsListComponent,
    FleetFilterDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FleetManagementRouting
  ],
  entryComponents: [FleetFilterDialogComponent]
})
export class FleetManagementModule { }

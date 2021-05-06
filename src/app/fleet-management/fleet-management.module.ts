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
import { InspectionFilterDialogComponent } from './inspections/inspections-list/inspection-filter-dialog/inspection-filter-dialog.component';
import { FillupFilterDialogComponent } from './fillups/fillups-list/fillup-filter-dialog/fillup-filter-dialog.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { LeasingCompaniesDetailComponent } from './leasing-companies/leasing-companies-detail/leasing-companies-detail.component';
import { FleetDetailComponent } from './fleet/fleet-detail/fleet-detail.component';



@NgModule({
  declarations: [
    StaffListComponent,
    FleetListComponent,
    FillupsListComponent,
    LeasingCompaniesListComponent,
    InspectionsListComponent,
    FleetFilterDialogComponent,
    InspectionFilterDialogComponent,
    FillupFilterDialogComponent,
    LeasingCompaniesDetailComponent,
    FleetDetailComponent,
  ],
    imports: [
        CommonModule,
        SharedModule,
        FleetManagementRouting,
    ],
  entryComponents: [FleetFilterDialogComponent]
})
export class FleetManagementModule { }

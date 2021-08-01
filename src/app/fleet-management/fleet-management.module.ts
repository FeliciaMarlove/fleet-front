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
import { LeasingCompaniesDetailComponent } from './leasing-companies/leasing-companies-detail/leasing-companies-detail.component';
import { FleetCreateComponent } from './fleet/fleet-create/fleet-create.component';
import { FleetViewComponent } from './fleet/fleet-view/fleet-view.component';
import {FuelDisplayPipe} from '../shared/pipe/fuel-display.pipe';
import {CarShortDisplayPipe} from '../shared/pipe/car-short-display.pipe';
import {StaffShortDisplayPipe} from '../shared/pipe/staff-short-display.pipe';
import { InspectionCreateComponent } from './inspections/inspection-create/inspection-create.component';

/**
 * Fleet management module contains the component for the fleet management app
 */

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
    FleetCreateComponent,
    FleetViewComponent,
    InspectionCreateComponent,
  ],
    imports: [
        CommonModule,
        SharedModule,
        FleetManagementRouting,
    ],
  providers: [
    FuelDisplayPipe,
    CarShortDisplayPipe,
    StaffShortDisplayPipe
  ],
  entryComponents: [FleetFilterDialogComponent]
})
export class FleetManagementModule { }

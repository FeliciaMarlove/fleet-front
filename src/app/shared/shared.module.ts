import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CarShortDisplayPipe} from './pipe/car-short-display.pipe';
import {DiscrepancyToDisplayNamePipe} from './pipe/discrepancy-to-display-name.pipe';
import {BelgianPhoneNumberPipe} from './pipe/belgian-phone-number.pipe';
import {StaffShortDisplayPipe} from './pipe/staff-short-display.pipe';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {MatSliderModule} from '@angular/material/slider';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FuelDisplayPipe} from './pipe/fuel-display.pipe';
import {NoOptionFilterDialogComponent} from './utils/no-option-filter-dialog/no-option-filter-dialog.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTooltipModule} from '@angular/material/tooltip';
import { FilterDisplayPipe } from './pipe/filter-display.pipe';

@NgModule({
  declarations: [
    CarShortDisplayPipe,
    DiscrepancyToDisplayNamePipe,
    BelgianPhoneNumberPipe,
    StaffShortDisplayPipe,
    FuelDisplayPipe,
    NoOptionFilterDialogComponent,
    FilterDisplayPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    MatButtonToggleModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatSliderModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule
  ],
  exports: [
    RouterModule,
    // ---- SHARED MATERIAL MODULES
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    MatButtonToggleModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatSliderModule,
    MatTableModule,
    MatListModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    MatTooltipModule,
    // ---- PIPES
    CarShortDisplayPipe,
    DiscrepancyToDisplayNamePipe,
    BelgianPhoneNumberPipe,
    StaffShortDisplayPipe,
    FuelDisplayPipe,
    FilterDisplayPipe,
    // ---- SHARED COMPONENTS
    NoOptionFilterDialogComponent,
  ]
})
export class SharedModule {
}

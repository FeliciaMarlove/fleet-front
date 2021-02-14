import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {
  MatButtonModule, MatButtonToggleModule, MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatOptionModule, MatPaginatorModule, MatSelectModule,
  MatSliderModule, MatSnackBarModule, MatTableModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [

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
  ],
  exports: [
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
    MatPaginatorModule
  ]
})
export class SharedModule { }

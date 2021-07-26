import {Component, Inject, OnInit} from '@angular/core';
import {CarService} from '../../../core/http-services/car.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Car} from '../../../shared/models/car.model';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {StaffMemberService} from '../../../core/http-services/staff-member.service';
import {LeasingCompanyService} from '../../../core/http-services/leasing-company.service';
import {DecimalPipe} from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {LeasingCompany} from '../../../shared/models/leasing-company.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FuelDisplayPipe} from '../../../shared/pipe/fuel-display.pipe';
import {YesNoDialogComponent} from '../../../shared/utils/dirty-form-onleave-dialog/yes-no-dialog.component';
import {UiDimensionValues} from '../../../shared/utils/ui-dimension-values';
import {InspectionService} from '../../../core/http-services/inspection.service';
import {LinkCarStaffDialogComponent} from '../../../shared/utils/link-car-staff-dialog/link-car-staff-dialog.component';
import {StaffShortDisplayPipe} from '../../../shared/pipe/staff-short-display.pipe';
import {ErrorOutputService} from '../../../shared/utils/error-output.service';

export const DateFormat = {
  parse: {
    dateInput: 'input',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@Component({
  selector: 'app-fleet-view',
  templateUrl: './fleet-view.component.html',
  styleUrls: ['./fleet-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormat }
  ]
})
export class FleetViewComponent implements OnInit {
  public title = 'Car details';
  public form: FormGroup;
  public car: Car;
  public leasingCompany: LeasingCompany;
  public changeableIconStaff = 'info';
  public changeableIconLeasing = 'info';
  public endBeforeStart = false;
  public durationOfContract: number;
  public durationInformation: string;
  public hasModifications = false;

  constructor(
    public matDialogRef: MatDialogRef<FleetViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {car: Car},
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private carService: CarService,
    private staffService: StaffMemberService,
    private leasingService: LeasingCompanyService,
    private inspectionService: InspectionService,
    public numberPipe: DecimalPipe,
    public fuelTypePipe: FuelDisplayPipe,
    public staffMemberPipe: StaffShortDisplayPipe,
    private errorOutputService: ErrorOutputService,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initCar();
    this.initForm();
  }

  private initCar() {
    this.car = this.data.car;
    this.getLeasingCompany();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      plateNumber: [{value: this.car.plateNumber, disabled: true}],
      brand: [{value: this.car.brand, disabled: true}],
      model: [{value: this.car.model, disabled: true}],
      fuelType: [{value: this.fuelTypePipe.transform(this.car.fuelType), disabled: true}],
      averageConsumption: [{value: this.car.averageConsumption, disabled: true}],
      kilometers: [{value: this.numberPipe.transform(this.car.kilometers), disabled: true}],
      startDate: [{value: this.car.startDate, disabled: true}],
      endDate: [{value: this.car.endDate, disabled: false}],
      ongoing: [{value: this.car.ongoing ? 'Ongoing' : 'Terminated', disabled: true}],
      freeText: [{value: this.car.freeText, disabled: false}],
      staffMember: [{value: this.car.staffMember ? this.car.staffMember.staffFirstName + ' ' + this.car.staffMember.staffLastName : '', disabled: this.car.staffMember}],
      leasingCompany: [{value: this.car.leasingCompany?.leasingCompanyName, disabled: true}],
    });
  }

  public doOpenInspection() {
    if (this.form.dirty) {
      this.dialog.open(YesNoDialogComponent, {
        width: UiDimensionValues.yesNoDialogPixelWidth,
        height: UiDimensionValues.yesNoDialogPixelHeight,
        data: {helperText: 'Do you want to save modifications before leaving this screen? Unsaved modifications will be lost.'}
      })
        .afterClosed().subscribe(toSave => {
          if (toSave) {
            this.doUpdate();
          }
      });
    }
    // TODO both when the dialog exists in inspection package
    if (this.car.inspection) {
      console.log('open existing inspection');
    } else {
      console.log('open screen to create new inspection');
    }
  }

  public doUpdate() {
    this.car.endDate = this.form.controls.endDate.value;
    this.car.freeText = this.form.controls.freeText.value;
    this.carService.updateCar(this.car).subscribe(() => {
      this.matDialogRef.close(true);
      this.matSnackBar.open('Car was updated', 'OK', {
          panelClass: 'info-snackbar'
        });
      },
      () => this.errorOutputService.outputFatalErrorInSnackBar('fleet_update', 'Update failed.')
    );
  }

  public doAddStaffMember() {
    this.dialog.open(LinkCarStaffDialogComponent, {
      width: UiDimensionValues.linkStaffCarDialogPixelWidth,
      height: UiDimensionValues.linkStaffCarDialogPixelHeight,
      data: {car: this.car, staffMember: this.car.staffMember}
    })
      .afterClosed().subscribe(staffMember => {
        if (staffMember) {
          this.form.get('staffMember').setValue(this.staffMemberPipe.transform(staffMember));
          this.hasModifications = true;
        }
      },
      () => this.errorOutputService.outputFatalErrorInSnackBar('fleet_update', 'Updating the staff member failed.')
    );
  }

  private getLeasingCompany() {
    if (!this.car.leasingCompany) {
      this.leasingService.getLeasingCompany(this.car.leasingCompanyId).subscribe(leasComp => {
        this.car.leasingCompany = leasComp;
        this.form.setControl('leasingCompany', new FormControl({value: this.car.leasingCompany.leasingCompanyName, disabled: true}));
      });
    }
  }

  public informCopied() {
    this.snackBar.open('Email address copied');
  }

  public changeIconStaff() {
    if (this.changeableIconStaff === 'info') {
      this.changeableIconStaff = 'content_copy';
    } else {
      (this.changeableIconStaff = 'info');
    }
  }

  public changeIconLeasing() {
    if (this.changeableIconLeasing === 'info') {
      this.changeableIconLeasing = 'content_copy';
    } else {
      (this.changeableIconLeasing = 'info');
    }
  }

  public checkEndAfterStart() {
    if (this.form.controls.endDate.value) {
      const end = this.form.controls.endDate.value;
      const start = new Date(this.form.controls.startDate.value);
      this.endBeforeStart = end <= start;
      if (!this.endBeforeStart) {
        this.calculateDuration(start, end);
      } else {
        this.durationInformation = '';
      }
    }
    if (this.form.controls.startDate.value && !this.form.controls.endDate.value) {
      this.endBeforeStart = false;
    }
  }

  private calculateDuration(start, end) {
    // const days = Math.ceil((end - start) / (1000 * 3600 * 24));
    const e = new Date(end);
    const s = new Date(start);
    const numberCalendarMonths = e.getMonth() - s.getMonth() +
      (12 * (e.getFullYear() - s.getFullYear()));
    this.durationInformation = `The leasing contract duration is ${numberCalendarMonths} months.`;
  }
}

import {Component, Inject, OnInit} from '@angular/core';
import {CarService} from '../../../core/http-services/car.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Car} from '../../../shared/models/car.model';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {StaffMemberService} from '../../../core/http-services/staff-member.service';
import {LeasingCompanyService} from '../../../core/http-services/leasing-company.service';
import {DecimalPipe} from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {LeasingCompany} from '../../../shared/models/leasing-company.model';
import {MatSnackBar} from '@angular/material/snack-bar';

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

  constructor(
    public matDialogRef: MatDialogRef<FleetViewComponent>,
    private carService: CarService,
    @Inject(MAT_DIALOG_DATA) public data: {car: Car},
    private formBuilder: FormBuilder,
    private staffService: StaffMemberService,
    private leasingService: LeasingCompanyService,
    public numberPipe: DecimalPipe,
    private snackBar: MatSnackBar
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
      fuelType: [{value: this.car.fuelType, disabled: true}],
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
    console.log('check if form is dirty and ask for confirmation'); // TODO
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
    },
      error => console.log(error) // TODO handle error
    );
  }

  public doAddStaffMember() {
    // TODO link staff member to car then refresh
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

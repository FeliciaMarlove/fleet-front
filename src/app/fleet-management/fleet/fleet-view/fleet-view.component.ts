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

  constructor(
    public matDialogRef: MatDialogRef<FleetViewComponent>,
    private carService: CarService,
    @Inject(MAT_DIALOG_DATA) public data: {car: Car},
    private formBuilder: FormBuilder,
    private staffService: StaffMemberService,
    private leasingService: LeasingCompanyService,
    public numberPipe: DecimalPipe
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

      inspection: [{value: this.car.inspection, disabled: false}], // TODO permettre de créer une inspection pour la voiture ou consulter si elle existe -> lier à l'écran pour créer l'inspection quand il existera

      });
  }

  public doUpdate() {
    // TODO update -> callback close
    this.matDialogRef.close(true);
  }

  public doAddStaffMember() {
    // TODO link staff member to car then refresh
  }

  private getLeasingCompany() {
    if (!this.car.leasingCompany) {
      this.leasingService.getLeasingCompany(this.car.leasingCompanyId).subscribe(leasComp => {
        this.car.leasingCompany = leasComp;
        this.form.setControl('leasingCompany', new FormControl(this.car.leasingCompany.leasingCompanyName));
      });
    }
  }
}

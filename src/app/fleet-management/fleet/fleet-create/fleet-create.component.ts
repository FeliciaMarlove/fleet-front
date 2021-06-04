import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {CarService} from '../../../core/http-services/car.service';
import {Brand} from '../../../shared/enums/brand.enum';
import {FuelType} from '../../../shared/enums/fuel-type.enum';
import {LeasingCompanyService} from '../../../core/http-services/leasing-company.service';
import {LeasingCompany} from '../../../shared/models/leasing-company.model';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatSelectChange} from '@angular/material/select';

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
  selector: 'app-fleet-detail',
  templateUrl: './fleet-create.component.html',
  styleUrls: ['./fleet-create.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormat }
  ]
})
export class FleetCreateComponent implements OnInit {
  public form: FormGroup;
  public title = 'Create';
  public brandEnum = Brand;
  public fuelEnum = FuelType;
  public leasingCompanies: LeasingCompany[] = [];
  public endBeforeStart = false;
  public durationOfContract: number;
  public durationInformation: string;
  public isElectric = false;

  constructor(
    public matDialogRef: MatDialogRef<FleetCreateComponent>,
    private formBuilder: FormBuilder,
    private carService: CarService,
    private leasingCompaniesService: LeasingCompanyService
  ) { }

  ngOnInit(): void {
    this.initLeasingCompanies();
    this.initForm();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      plateNumber: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{1}-[a-zA-Z]{3}-[0-9]{3}')])],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      fuelType: ['', Validators.required],
      averageConsumption: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      freeText: [''],
      leasingCompanyId: ['', Validators.required]
    });
  }

  public checkFuelChange($event: MatSelectChange) {
    const consumpField = this.form.get('averageConsumption');
    if ($event.value !== 'FULL_ELECTRIC') {
      this.isElectric = false;
      consumpField.setValidators(Validators.required);
      consumpField.enable();
    } else {
      this.isElectric = true;
      consumpField.clearValidators();
      consumpField.disable();
    }
    consumpField.updateValueAndValidity();
  }

  public checkEndAfterStart() {
    if (this.form.controls.endDate.value && this.form.controls.startDate.value) {
      const end = this.form.controls.endDate.value;
      const start = this.form.controls.startDate.value;
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

  private initLeasingCompanies() {
    this.leasingCompaniesService.getLeasingCompanies('ALL', null).subscribe( leasCompanies => {
      this.leasingCompanies = leasCompanies;
    });
  }

  public doClose() {
    this.carService.createCar(this.form.value).subscribe( () => {
      this.matDialogRef.close(true);
    });
  }

}

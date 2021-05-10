import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {CarService} from '../../../core/http-services/car.service';
import {Brand} from '../../../shared/enums/brand.enum';
import {FuelType} from '../../../shared/enums/fuel-type.enum';
import {LeasingCompanyService} from '../../../core/http-services/leasing-company.service';
import {LeasingCompany} from '../../../shared/models/leasing-company.model';

@Component({
  selector: 'app-fleet-detail',
  templateUrl: './fleet-detail.component.html',
  styleUrls: ['./fleet-detail.component.scss']
})
export class FleetDetailComponent implements OnInit {
  public form: FormGroup;
  public title = 'Create';
  public brandEnum = Brand;
  public fuelEnum = FuelType;
  public leasingCompanies: LeasingCompany[] = [];
  public endBeforeStart = false;

  constructor(
    public matDialogRef: MatDialogRef<FleetDetailComponent>,
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

  public checkEndAfterStart() {
    if (this.form.controls.endDate.value && this.form.controls.startDate.value) {
      const end: Date = this.form.controls.endDate.value;
      const start: Date = this.form.controls.startDate.value;
      this.endBeforeStart = end <= start;
    }
    if (this.form.controls.startDate.value && !this.form.controls.endDate.value) {
      this.endBeforeStart = false;
    }
  }

  private initLeasingCompanies() {
    this.leasingCompaniesService.getLeasingCompanies(null, null).subscribe( leasCompanies => {
      this.leasingCompanies = leasCompanies;
    });
  }

  public doClose() {
    this.carService.createCar(this.form.value).subscribe( () => {
      this.matDialogRef.close(true);
    });
  }

}

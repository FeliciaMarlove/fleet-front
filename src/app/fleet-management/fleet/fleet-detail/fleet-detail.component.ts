import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {CarService} from '../../../core/http-services/car.service';

@Component({
  selector: 'app-fleet-detail',
  templateUrl: './fleet-detail.component.html',
  styleUrls: ['./fleet-detail.component.scss']
})
export class FleetDetailComponent implements OnInit {
  public form: FormGroup;
  public title = 'Create';

  constructor(
    public matDialogRef: MatDialogRef<FleetDetailComponent>,
    private formBuilder: FormBuilder,
    private carService: CarService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      plateNumber: ['', Validators.compose([Validators.required, Validators.pattern('d-www-ddd')])],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      fuelType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      freeText: [''],
      leasingCompany: ['', Validators.required]
    });
  }

  public doClose() {
    this.carService.createCar(this.form.value).subscribe( resp => {
      console.log(resp);
      this.matDialogRef.close(true);
    });
  }

}

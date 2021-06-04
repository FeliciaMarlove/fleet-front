import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {InspectionService} from '../../../core/http-services/inspection.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {Car} from '../../../shared/models/car.model';
import {CarService} from '../../../core/http-services/car.service';

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
  selector: 'app-inspection-create',
  templateUrl: './inspection-create.component.html',
  styleUrls: ['./inspection-create.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormat }
  ]
})
export class InspectionCreateComponent implements OnInit {
  public form: FormGroup;
  public title = 'Create';
  public plateNumber: string = this.data?.plateNumber;
  public maxDate = new Date();
  public minDate = new Date(new Date().setMonth(new Date().getMonth() - 6));
  public cars: Car[] = [];
  public car: Car;

  constructor(
    public matDialogRef: MatDialogRef<InspectionCreateComponent>,
    private formBuilder: FormBuilder,
    private inspectionService: InspectionService,
    private carService: CarService,
    @Inject(MAT_DIALOG_DATA) public data: { plateNumber }
  ) { }

  ngOnInit(): void {
    if (!this.plateNumber) {
      this.initCars();
    } else {
      this.initCar();
    }
    this.initForm();
  }

  private initCars() {
    this.carService.getCars('INSPECTABLE', null).subscribe(cars => {
      this.cars = cars;
    });
  }

  private initCar() {
    this.carService.getCar(this.plateNumber).subscribe(car => {
      this.car = car;
    });
  }

  private initForm() {
    this.form = this.formBuilder.group({
      inspectionDate: ['', Validators.required],
      expertisedBy: ['', Validators.required],
      damaged: [''],
      picturesFolder: [''],
      inspectionReportFile: [''],
      plateNumber: [!!this.plateNumber ? this.plateNumber : '', Validators.required]
    });

    //TODO if plate number field disabled ; if no plate show all where !inspection && endDate entre now et now - 6 mois (créer filtre back)
    // TODO show short car name à côté du field plaque
  }


  public send() {
    // TODO ajouter formcontrol sentDate avec la date du jour
  }
}

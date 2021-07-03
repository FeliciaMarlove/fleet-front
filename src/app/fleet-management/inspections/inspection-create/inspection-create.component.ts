import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {InspectionService} from '../../../core/http-services/inspection.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {Car} from '../../../shared/models/car.model';
import {CarService} from '../../../core/http-services/car.service';
import {CarShortDisplayPipe} from '../../../shared/pipe/car-short-display.pipe';
import {BLOB_GOAL, BlobStorageService} from '../../../core/azure-services/blob-storage.service';

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

const azureBlobContainerName = 'inspection';
const fileReader = new FileReader();

@Component({
  selector: 'app-inspection-create',
  templateUrl: './inspection-create.component.html',
  styleUrls: ['./inspection-create.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: DateFormat}
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
  public carLabel;

  constructor(
    public matDialogRef: MatDialogRef<InspectionCreateComponent>,
    private formBuilder: FormBuilder,
    private inspectionService: InspectionService,
    private carService: CarService,
    private carPipe: CarShortDisplayPipe,
    private blogStorageService: BlobStorageService,
    @Inject(MAT_DIALOG_DATA) public data: { plateNumber }
  ) {
  }

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
      this.form.get('plateNumber').setValue(this.car.plateNumber);
      this.carLabel = this.plateNumber + ' - ' + this.carPipe.transform(this.car);
    });
  }

  private initForm() {
    this.form = this.formBuilder.group({
      inspectionDate: [''],
      expertisedBy: [''],
      damaged: [''],
      plateNumber: [!!this.plateNumber ? this.plateNumber : ''],
      picture: ['']
    });
  }


  public doSend() {
    // TODO ajouter formcontrol sentDate avec la date du jour
    // TODO traiter les fichiers avant envoi ajouter formcontrol
  }

  public async uploadFiles(event) {
    // TODO logique de l'upload à trigger seulement au send pour éviter écritures inutiles
    // TODO security checkdata type file.type.match('image.*') AVANT UPLOAD -> v. good practice sécu upload files ?
    // TODO check if multiple files solution?
    // TODO TEST sans laisser le blob container public
    // TODO méthode diff pour up rapport et des images
    // TODO comment catch les erreurs côté azure proprement ??
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (file) {
        fileReader.readAsDataURL(file);
        const blobUrl = this.blogStorageService.writeAzureBlockBlob(azureBlobContainerName, BLOB_GOAL.INSPECTION_IMAGE, file);
      }
    }
  }
}

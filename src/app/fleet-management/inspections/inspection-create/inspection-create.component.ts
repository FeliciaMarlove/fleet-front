import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {InspectionService} from '../../../core/http-services/inspection.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {Car} from '../../../shared/models/car.model';
import {CarService} from '../../../core/http-services/car.service';
import {CarShortDisplayPipe} from '../../../shared/pipe/car-short-display.pipe';
import { BlobServiceClient, newPipeline } from '@azure/storage-blob';

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
  public carLabel;

  constructor(
    public matDialogRef: MatDialogRef<InspectionCreateComponent>,
    private formBuilder: FormBuilder,
    private inspectionService: InspectionService,
    private carService: CarService,
    private carPipe: CarShortDisplayPipe,
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
    //TODO logique de l'upload à trigger seulement au send pour éviter écritures inutiles
// security checkdata type file.type.match('image.*')
    if (event.target.files && event.target.files.length) {
      console.log(event.target.files[0]);
      const file = event.target.files[0];
      if (file) {
        console.log(typeof file);

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        console.log(typeof file);


        // // TODO -> créer un service pour gérer l'envoi de fichiers vers Azure Blob
        // tout mettre dans un try catch
        const account = 'tfefleetstorage';
        const sas = 'sp=racwl&st=2021-06-29T16:40:28Z&se=2021-12-31T01:40:28Z&sv=2020-02-10&sr=c&sig=G6uhwfORW%2BanRC1szwArLSg5SZf%2BD5IWT%2BNDpybQHaI%3D';
        const containerName = 'inspection';

        const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/${containerName}?${sas}`);

        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobName = 'go_fuck_yourself'; // ! unique names if N ups
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        console.log(file);
        const uploadResponse = await blockBlobClient.upload(file, file.size);
        // recup url https://tfefleetstorage.blob.core.windows.net/inspection/inspection/go_fuck_yourself
      }

    }
  }
}

import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {InspectionService} from '../../../core/http-services/inspection.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {Car} from '../../../shared/models/car.model';
import {CarService} from '../../../core/http-services/car.service';
import {CarShortDisplayPipe} from '../../../shared/pipe/car-short-display.pipe';
import {BLOB_GOAL, BlobStorageService} from '../../../core/azure-services/blob-storage.service';
import {ErrorOutputService} from '../../../shared/utils/error-output.service';
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
  private latestPictures: [] = [];
  private latestReport;
  private imageUrls: string[] = [];
  private reportUrl: string;

  constructor(
    public matDialogRef: MatDialogRef<InspectionCreateComponent>,
    private formBuilder: FormBuilder,
    private inspectionService: InspectionService,
    private carService: CarService,
    private carPipe: CarShortDisplayPipe,
    private blobStorageService: BlobStorageService,
    private errorOutputService: ErrorOutputService,
    public matSnackBar: MatSnackBar,
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
      inspectionDate: ['', Validators.required],
      expertisedBy: ['', Validators.required],
      damaged: [''],
      car: [!!this.plateNumber ? this.plateNumber : '', Validators.required],
      picture: [''],
      report: ['']
    });
  }

  public async doSend() {
    await this.uploadPictures();
    await this.uploadReport();
    // set values for files urls
    this.form.addControl('picturesFiles', new FormControl(this.imageUrls.toString()));
    this.form.addControl('inspectionReportFile', new FormControl(this.reportUrl));
    // remove plain files from form
    this.form.removeControl('picture');
    this.form.removeControl('report');
    this.form.addControl('sentDate', new FormControl(new Date()));
    this.inspectionService.createInspection(this.form.value).subscribe( () => {
      this.matSnackBar.open('Inspection was saved', 'OK', {
        panelClass: 'info-snackbar'
      });
    },
      () => this.errorOutputService.outputFatalErrorInSnackBar('inspection_create', 'Creation failed')
    );
  }

  private async uploadPictures() {
    if (this.latestPictures) {
      const picturesFiles = this.latestPictures;
      if (picturesFiles) {
        for (const file of picturesFiles) {
          fileReader.readAsDataURL(file);
          await this.blobStorageService.writeAzureBlockBlob(azureBlobContainerName, BLOB_GOAL.INSPECTION_IMAGE, file).then(blobUrl => {
            this.imageUrls.push(blobUrl);
          });
        }
      }
    }
  }

  private async uploadReport() {
    if (this.latestReport) {
      fileReader.readAsDataURL(this.latestReport);
      await this.blobStorageService.writeAzureBlockBlob(azureBlobContainerName, BLOB_GOAL.INSPECTION_REPORT, this.latestReport).then(blobUrl => {
        this.reportUrl = blobUrl;
      });
    }
  }

  /**
   * Make security and validity checks on files
   * Save value of the field in a variable if it's validated
   * @param $event the content of the file input field
   */
  public checkFiles($event) {
    if (this.checkFilesNumber($event)) {
      if (this.checkFileTypes($event)) {
        if (this.checkFileSizes($event)) {
          const fieldName = $event.target.getAttribute('formControlName');
          switch (fieldName) {
            case 'picture': this.latestPictures = $event.target.files; break;
            case 'report': this.latestReport = $event.target.files[0]; break;
            default: this.errorOutputService.outputFatalErrorInSnackBar('inspection_create', 'File uploaded from unregistered field');
          }
        }
      }
    }
  }

  /**
   * Check that there are no more than 5 files per upload
   *  Write a log, notify user and empty input field if more than 5 are selected
   * @param $event
   * @private
   */
  private checkFilesNumber($event): boolean {
    const numberOfFiles = $event.target.files.length;
    if (numberOfFiles > 5) {
      this.errorOutputService.outputFatalErrorInSnackBar('inspection_create', 'You cannot upload more than 5 files');
      $event.target.value = null;
      return false;
    }
    return true;
  }

  /**
   * Compare accepted file types with received file types
   * Write a log, notify user and empty input field if a wrong type is detected
   * @param $event
   * @private
   */
  private checkFileTypes($event): boolean {
    // get "accept" property from file input field as a string
    const acceptedTypes = $event.target.accept;
    const receivedFiles = $event.target.files;
    // files is a HTMLCollection -> to use iterable protocol use spread operator ...
    [...receivedFiles].forEach(file => {
      const ext = '.'.concat(file.type.substr(file.type.indexOf('/') + 1));
      if (!file.type) {
        this.errorOutputService.outputFatalErrorInSnackBar('inspection_create', 'File extension must be ' + acceptedTypes + ', tried to load unrecognized file type (file name: ' + file.name + ')');
        $event.target.value = null;
        return false;
      }
      if (!acceptedTypes.includes(ext)) {
        this.errorOutputService.outputFatalErrorInSnackBar('inspection_create', 'File extension must be ' + acceptedTypes + ', tried to load ' + file.type + ' (file name: ' + file.name + ')');
        $event.target.value = null;
        return false;
      }
    });
    return true;
  }

  /**
   * Check that file sizes do not exceed 1 Mo
   * Write a log, notify user and empty input field if a bigger size is detected
   * @param $event
   * @private
   */
  private checkFileSizes($event): boolean {
    const receivedFiles = $event.target.files;
    const maxSizeInOctets = 1_048_576; // 1 Mo
    // files is a HTMLCollection -> to use iterable protocoal use spread operator ...
    [...receivedFiles].forEach(file => {
      if (file.size > maxSizeInOctets) {
        this.errorOutputService.outputFatalErrorInSnackBar('inspection_create', 'File size cannot be higher than 1 Mo, tried to load ' + this.getFileSizeInMo(file.size) + ' (file name: ' + file.name + ')');
        $event.target.value = null;
        return false;
      }
    });
    return true;
  }

  /**
   * Get file size in Mo from octets value
   * @param octets
   * @private
   */
  // source https://developer.mozilla.org/fr/docs/Web/HTML/Element/Input/file#exemples
  private getFileSizeInMo(octets: number) {
    return (octets / 1048576).toFixed(2) + ' Mo';
  }
}

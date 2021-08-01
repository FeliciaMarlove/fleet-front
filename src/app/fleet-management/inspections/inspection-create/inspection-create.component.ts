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
import {throwError} from 'rxjs';
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
    private blogStorageService: BlobStorageService,
    private errorOutputService: ErrorOutputService,
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
      picture: [''],
      report: ['']
    });
  }

  // const file = event.target.files[0]; pour récup 1 fichier (report)



  public doSend() {
    this.uploadFiles().then( res => {
      console.log(res);
    });
    // TODO ajouter formcontrol sentDate avec la date du jour
    // TODO traiter les fichiers avant envoi ajouter formcontrol
  }

  private async uploadFiles(): Promise<string[]> {
    // TODO logique de l'upload à trigger seulement au send pour éviter écritures inutiles
    // TODO security checkdata type file.type.match('image.*') AVANT UPLOAD -> v. good practice sécu upload files ?
    // TODO check if multiple files solution?
    // TODO TEST sans laisser le blob container public
    // TODO méthode diff pour up rapport et des images
    // TODO comment catch les erreurs côté azure proprement ??

    if (this.latestPictures) {
      const picturesFiles = this.latestPictures;
      const reportFile = this.latestReport;
      if (picturesFiles) {
        [...picturesFiles].forEach(file => {
            fileReader.readAsDataURL(file);
            this.blogStorageService.writeAzureBlockBlob(azureBlobContainerName, BLOB_GOAL.INSPECTION_IMAGE, file).then(blobUrl => {
              this.imageUrls.push(blobUrl);
            }).catch(() => this.errorOutputService.outputFatalErrorInSnackBar('inspection_create', 'File upload failed for pictures'))
              .finally(() => {
                fileReader.readAsDataURL(reportFile);
                this.blogStorageService.writeAzureBlockBlob(azureBlobContainerName, BLOB_GOAL.INSPECTION_IMAGE, file).then(blobUrl => {
                  this.reportUrl = blobUrl;
                }).catch(() => this.errorOutputService.outputFatalErrorInSnackBar('inspection_create', 'File upload failed for report'));
              }).finally(() => {
                // TODO récup les urls dans return et traiter dans form

            });
        });
      }
    }
    return ['st1', 'st2'];
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

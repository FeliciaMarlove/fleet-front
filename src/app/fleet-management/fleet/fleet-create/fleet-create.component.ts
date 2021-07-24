import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CarService} from '../../../core/http-services/car.service';
import {Brand} from '../../../shared/enums/brand.enum';
import {FuelType} from '../../../shared/enums/fuel-type.enum';
import {LeasingCompanyService} from '../../../core/http-services/leasing-company.service';
import {LeasingCompany} from '../../../shared/models/leasing-company.model';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatSelectChange} from '@angular/material/select';
import {StaffMemberService} from '../../../core/http-services/staff-member.service';
import {StaffMember} from '../../../shared/models/staff-member.model';
import {UiDimensionValues} from '../../../shared/utils/ui-dimension-values';
import {YesNoDialogComponent} from '../../../shared/utils/dirty-form-onleave-dialog/yes-no-dialog.component';
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

@Component({
  selector: 'app-fleet-detail',
  templateUrl: './fleet-create.component.html',
  styleUrls: ['./fleet-create.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: DateFormat}
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
  public staff: StaffMember[] = [];
  public plateInvalid = false;
  private readonly platePattern = '[0-9]{1}-[a-zA-Z]{3}-[0-9]{3}';

  constructor(
    public matDialogRef: MatDialogRef<FleetCreateComponent>,
    private formBuilder: FormBuilder,
    private carService: CarService,
    private leasingCompaniesService: LeasingCompanyService,
    private staffMemberService: StaffMemberService,
    private matDialog: MatDialog,
    private errorOutputService: ErrorOutputService,
    private matSnackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.initLeasingCompanies();
    this.initStaff();
    this.initForm();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      plateNumber: ['', Validators.compose([Validators.required, Validators.pattern(this.platePattern)])],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      fuelType: ['', Validators.required],
      averageConsumption: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      freeText: [''],
      leasingCompanyId: ['', Validators.required],
      staffMemberId: ['', Validators.required]
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

  /**
   * Check if staff member already has an ongoing car ownership
   * @param $event method is called when the event of type "selection change" is done in the vue
   */
  public checkStaffLinked($event: MatSelectChange) {
    this.staffMemberService.getCurrentCarOfStaffMember($event.value).subscribe(res => {
        if (res) {
          this.matDialog.open(YesNoDialogComponent, {
            width: UiDimensionValues.yesNoDialogPixelWidth,
            height: UiDimensionValues.yesNoDialogPixelHeight,
            data: {helperText: 'This staff member already has a car, stop current ownership and change car?'}
          })
            .afterClosed().subscribe(doProceed => {
            if (!doProceed) {
              this.form.controls.staffMemberId.reset();
            }
          });
        }
      },
      () => this.errorOutputService.outputFatalErrorInSnackBar('fleet_create', 'Could not check if car already has an owner. This action could overwrite existing data! Please do not proceed.')
    );
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
    this.leasingCompaniesService.getLeasingCompanies('ALL', null).subscribe(leasCompanies => {
        this.leasingCompanies = leasCompanies;
      },
      () => this.errorOutputService.outputFatalErrorInSnackBar('fleet_create', 'Leasing companies could not be loaded.')
    );
  }

  private initStaff() {
    this.staffMemberService.getStaff('ALL', null).subscribe(staff => {
        this.staff = staff;
      },
      () => this.errorOutputService.outputFatalErrorInSnackBar('fleet_create', 'Staff members could not be loaded.')
    );
  }

  public doClose() {
    this.carService.createCar(this.form.value).subscribe(() => {
      this.matDialogRef.close(true);
      this.matSnackBar.open('Car was created', 'OK', {
        panelClass: 'info-snackbar'
      });
    },
      () => this.errorOutputService.outputFatalErrorInSnackBar('fleet_create', 'Creating car failed')
    );
  }

  public checkPlate(plate: HTMLInputElement) {
    if (!plate.value.match(this.platePattern)) {
      this.plateInvalid = true;
    } else {
      this.plateInvalid = false;
    }
  }
}

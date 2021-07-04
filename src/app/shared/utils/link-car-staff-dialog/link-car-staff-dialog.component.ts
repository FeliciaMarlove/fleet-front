import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {StaffMemberService} from '../../../core/http-services/staff-member.service';
import {CarService} from '../../../core/http-services/car.service';
import {StaffMember} from '../../models/staff-member.model';
import {Car} from '../../models/car.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {YesNoDialogComponent} from '../dirty-form-onleave-dialog/yes-no-dialog.component';
import {UiDimensionValues} from '../ui-dimension-values';

@Component({
  selector: 'app-link-car-staff-dialog',
  templateUrl: './link-car-staff-dialog.component.html',
  styleUrls: ['./link-car-staff-dialog.component.scss']
})
export class LinkCarStaffDialogComponent implements OnInit {
  public form: FormGroup;
  public staffMember: StaffMember;
  public title = 'Link car and staff member';
  public cars: Car [] = [];
  public staff: StaffMember [] = [];

  constructor(
    public matDialogRef: MatDialogRef<LinkCarStaffDialogComponent>,
    private staffService: StaffMemberService,
    private carService: CarService,
    @Inject(MAT_DIALOG_DATA) public data: { car: Car, staffMember: StaffMember },
    private formBuilder: FormBuilder,
    private matDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.initStaffList();
    this.initForm();
  }

  private initStaffList() {
    this.staffService.getStaff('ALL', null).subscribe(staff => this.staff = staff.sort((s1, s2) => s1.staffLastName.localeCompare(s2.staffLastName)));
  }

  private initForm() {
    this.form = this.formBuilder.group({
      car: [{value: this.data.car.plateNumber, disabled: true}],
      staffMember: ['', Validators.required]
    });
  }

  public doLink() {
    const carId = this.data.car.plateNumber;
    const staffMember = this.form.get('staffMember').value;
    const staffMemId = staffMember.staffMemberId;
    this.staffService.getCurrentCarOfStaffMember(staffMemId).subscribe(currCar => {
      if (currCar) {
        this.matDialog.open(YesNoDialogComponent, {
          width: UiDimensionValues.yesNoDialogPixelWidth,
          height: UiDimensionValues.yesNoDialogPixelHeight,
          data: {helperText: 'This staff member already has a car, stop current ownership and change car?'}
        })
          .afterClosed().subscribe(doProceed => {
            if (doProceed) {
              this.staffService.setCarOfStaffMember(staffMemId, carId).subscribe(() => {
                this.matDialogRef.close(staffMember);
              });
            }
        });
      } else {
        this.staffService.setCarOfStaffMember(staffMemId, carId).subscribe(() => {
          this.matDialogRef.close(staffMember);
        });
      }
    });
  }
}

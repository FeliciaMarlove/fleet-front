import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StaffMemberService} from '../../../core/http-services/staff-member.service';
import {CarService} from '../../../core/http-services/car.service';
import {StaffMember} from '../../models/staff-member.model';
import {Car} from '../../models/car.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-link-car-staff-dialog',
  templateUrl: './link-car-staff-dialog.component.html',
  styleUrls: ['./link-car-staff-dialog.component.scss']
})
export class LinkCarStaffDialogComponent implements OnInit {
  public form: FormGroup;
  public car: Car;
  public staffMember: StaffMember;
  public title = 'Link car and staff member';
  public cars: Car [] = [];
  public staff: StaffMember [] = [];

  constructor(
    public matDialogRef: MatDialogRef<LinkCarStaffDialogComponent>,
    private staffService: StaffMemberService,
    private carService: CarService,
    @Inject(MAT_DIALOG_DATA) public data: {car: Car, staffMember: StaffMember},
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initDialog();
    this.initForm();
  }

  private initDialog() {
    this.car = this.data.car;
    this.staffMember = this.data.staffMember;
    if (this.car) {
      this.staffService.getStaff('ALL', null).subscribe(staff => this.staff = staff.sort((s1, s2) => s1.staffLastName.localeCompare(s2.staffLastName)));
    } else if (this.staffMember) {
      this.carService.getCars('ALL', null).subscribe(cars => this.cars = cars);
    } else {
      console.log('Something went wrong'); // TODO error handling
    }
  }

  private initForm() {
    this.form = this.formBuilder.group({
      car: [{value: this.car, disabled: this.car}, Validators.required],
      staffMember: [{value: this.staffMember, disabled: !this.car}, Validators.required]
    });
  }

  public doLink() {
    const carId = this.car ? this.car.plateNumber : this.form.get('car').value;
    const staffMember = !this.car ? this.staffMember : this.form.get('staffMember').value;
    const staffMemId = staffMember.staffMemberId;
    this.staffService.setCarOfStaffMember(staffMemId, carId).subscribe(() => {
      this.matDialogRef.close(staffMember);
    });
    // TODO DIALOG SI ECRASE REL EXISTANTE & verif tt en ordre
  }

}

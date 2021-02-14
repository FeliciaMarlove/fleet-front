import { Component, OnInit } from '@angular/core';
import {StaffMemberService} from '../../core/http-services/staff-member.service';
import {StaffMember} from '../../shared/models/staff-member.model';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {
  public displayedStaffList: StaffMember[] = [];

  constructor(
    private staffService: StaffMemberService
  ) { }

  ngOnInit() {
    this.initStaffList();
  }

  /**
   * Initiate the staff list with all staff members
   */
  private initStaffList(): void {
    this.staffService.getAllStaff().subscribe(
      staffList => this.displayedStaffList = staffList,
      error => console.log(error)
    );
  }

}

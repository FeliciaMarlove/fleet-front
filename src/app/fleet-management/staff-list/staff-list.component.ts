import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {StaffMemberService} from '../../core/http-services/staff-member.service';
import {StaffMember} from '../../shared/models/staff-member.model';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['view', 'fname', 'lname', 'hasCar', 'car_plate', 'car', 'unlink-action'];
  public colNames = ['', 'First name', 'Last name', 'Car?', 'Car plate', 'Car model', ''];
  public dataSource = new MatTableDataSource<StaffMember>();
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  public title = 'Staff members';

  constructor(
    private staffService: StaffMemberService
  ) { }

  ngOnInit() {
    this.initStaffList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Initiate the staff list with all staff members
   */
  private initStaffList(): void {
    this.staffService.getAllStaff().subscribe(
      staffList => {
        this.getStaffCurrentCar(staffList);
        this.dataSource.data = staffList;
      },
      error => console.log(error)
    );
  }

  /**
   * Assign current car to each staff member in the list
   * @param staffList The list of staff members
   */
  private getStaffCurrentCar(staffList: StaffMember[]) {
    for (const staff of staffList) {
      this.staffService.getCurrentCarOfStaffMember(staff.staffMemberId).subscribe( car => {
        staff.currentCar = car;
      });
    }
  }

  public doOpenStaffDetail(staffId: any) {

  }

  public doOpenUnlinkDialog(staffId: any) {

  }
}

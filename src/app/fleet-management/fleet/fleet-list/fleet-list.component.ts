import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatTableDataSource} from '@angular/material';
import {Car} from '../../../shared/models/car.model';
import {CarService} from '../../../core/http-services/car.service';
import {StaffMemberService} from '../../../core/http-services/staff-member.service';
import {PaginationListCreatorUtil} from '../../../shared/utils/pagination-list-creator.util';
import {FleetFilterDialogComponent} from './fleet-filter-dialog/fleet-filter-dialog.component';

@Component({
  selector: 'app-fleet-list',
  templateUrl: './fleet-list.component.html',
  styleUrls: ['./fleet-list.component.scss']
})

export class FleetListComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['view', 'cplate', 'cbrand', 'cmodel', 'cfuel', 'cstaff'];
  public colNames: string[] = ['', 'Plate', 'Brand', 'Model', 'Fuel', 'Owner'];
  public dataSource = new MatTableDataSource<Car>();
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  public title = 'Fleet';
  public paginationChoices: number[] = [10];
  public filter = '';
  public filterList = {brand: 'BRAND', active: 'ACTIVE', archived: 'ARCHIVED', fuel: 'FUEL', all: 'ALL'};
  public option = null;

  constructor(
    private carService: CarService,
    private staffService: StaffMemberService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.filter = this.filterList.archived;
    this.initCarsList();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  public doOpenFilterDialog() {
    this.dialog.open(FleetFilterDialogComponent, {
      width: '450px',
      height: '350px',
    });
  }

  /**
   * Initiate the list of cars according to current filter
   */
  private initCarsList() {
    this.carService.getCars(this.filter, this.option).subscribe(cars => this.assignCarList(cars));
  }

  /**
   * Assign cars list to the Data source
   * Create pagination according to list size and add Staff member to each Car in the list
   * @param cars The list of cars to display
   */
  private assignCarList(cars) {
    this.paginationChoices = PaginationListCreatorUtil.setPaginationList(cars);
    this.getCarOwner(cars);
    this.dataSource.data = cars;
  }

  /**
   * Assign staff member to each car in the list
   * @param cars The list of cars
   */
  private getCarOwner(cars: Car[]) {
    for (const car of cars) {
      this.staffService.getStaffMember(car.staffMemberId).subscribe(staffMember => {
        car.staffMember = staffMember;
      });
    }
  }

  public doOpenCarDetail(car: Car) {
    console.log(car);
  }
}

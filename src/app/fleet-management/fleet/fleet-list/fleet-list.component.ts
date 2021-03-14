import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Car} from '../../../shared/models/car.model';
import {CarService} from '../../../core/http-services/car.service';
import {StaffMemberService} from '../../../core/http-services/staff-member.service';
import {PaginationListCreatorUtil} from '../../../shared/utils/pagination-list-creator.util';
import {FleetFilterDialogComponent} from './fleet-filter-dialog/fleet-filter-dialog.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {FiltersListsService} from '../../../shared/utils/filters-lists.service';

@Component({
  selector: 'app-fleet-list',
  templateUrl: './fleet-list.component.html',
  styleUrls: ['./fleet-list.component.scss']
})

export class FleetListComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['view', 'cplate', 'cbrand', 'cmodel', 'cfuel', 'cstaff'];
  public colNames: string[] = ['', 'Plate', 'Brand', 'Model', 'Fuel', 'Owner'];
  public dataSource = new MatTableDataSource<Car>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public title = 'Fleet';
  public paginationChoices: number[] = [10];
  public filter: string = null;
  public filterList: object;
  public option: string = null;
  private defaultFilter: string;
  public readonly iAm = 'fleet';

  constructor(
    private carService: CarService,
    private staffService: StaffMemberService,
    private dialog: MatDialog,
    private filtersListsService: FiltersListsService
  ) {
  }

  ngOnInit() {
    this.initAvailableFiltersList();
    this.initDefaultFilter();
    this.initCarsList();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Initialize the list of available filters on a key:value base
   * First filter of the list will be used as default filter when entering the view
   */
  private initAvailableFiltersList() {
    this.filterList = this.filtersListsService.getFiltersList(this.iAm);
  }

  /**
   * Initialize the default filter with the key of the first filter in the available filters list
   * Assign default filter value to filter
   */
  private initDefaultFilter() {
    this.defaultFilter = String(Object.entries(this.filterList).slice(0, 1)[0][1]);
    this.filter = this.defaultFilter;
  }

  /**
   * Open dialog to choose filtering criteria, passing the available filters list and the current filter to the dialog
   * Get result after closing the dialog and filter accordingly the list
   */
  public doOpenFilterDialog() {
    this.dialog.open(FleetFilterDialogComponent, {
        width: '320px',
        height: '350px',
        data: {list: this.filterList, current: this.filter, option: this.option},
      }
    ).afterClosed().subscribe(filter => {
      if (filter) {
        this.filter = filter.filter;
        this.option = filter.option;
        this.initCarsList();
      }
    });
  }

  /**
   * Initiate the list of cars according to current filter
   */
  private initCarsList() {
    this.carService.getCars(this.filter, this.option).subscribe(cars => this.assignCarsList(cars));
  }

  /**
   * Assign cars list to the Data source
   * Create pagination according to list size and add Staff member to each Car in the list
   * @param cars The list of cars to display
   */
  private assignCarsList(cars) {
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

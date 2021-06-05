import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {StaffMemberService} from '../../core/http-services/staff-member.service';
import {StaffMember} from '../../shared/models/staff-member.model';
import {PaginationListCreatorUtil} from '../../shared/utils/pagination-list-creator.util';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {FleetFilterDialogComponent} from '../fleet/fleet-list/fleet-filter-dialog/fleet-filter-dialog.component';
import {FiltersListsService} from '../../shared/utils/filters-lists.service';
import {MatSort} from '@angular/material/sort';
import {Normalize} from '../../shared/utils/normalize.util';
import {UiDimensionValues} from '../../shared/utils/ui-dimension-values';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['staffFirstName', 'staffLastName', 'corporateEmail', 'communicationLanguage', 'hasCar', 'car_plate', 'car'];
  public colNames: string[] = ['unused', 'First name', 'Last name', 'Email', 'Language', 'Car?', 'Car plate', 'Car model'];
  public dataSource = new MatTableDataSource<StaffMember>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public title = 'Staff members';
  public paginationChoices: number[] = [10];
  public filter: string = null;
  public filterList: object;
  private defaultFilter: string;
  public option: string = null;
  public readonly iAm = 'staff';

  constructor(
    private staffService: StaffMemberService,
    private dialog: MatDialog,
    private filtersListsService: FiltersListsService
  ) { }

  ngOnInit() {
    this.initAvailableFiltersList();
    this.initDefaultFilter();
    this.initStaffList();
    this.initSearchPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    if (this.filterList) {
      this.defaultFilter = String(Object.entries(this.filterList).slice(0, 1)[0][1]);
      this.filter = this.defaultFilter;
    }
  }

  /**
   * Override filter predicate used by filter function of DataSource
   * Set filtered columns to staff name and first name (independently or together)
   */
  private initSearchPredicate() {
    this.dataSource.filterPredicate = (data: StaffMember, filter: string) => {
      const normalizedFilter = Normalize.normalize(filter);
      return  Normalize.normalize(data.staffFirstName).includes(normalizedFilter)
        || Normalize.normalize(data.staffLastName).includes(normalizedFilter)
      || Normalize.normalize(data.staffFirstName).concat(' ', Normalize.normalize(data.staffLastName)).includes(normalizedFilter)
        // tslint:disable-next-line:max-line-length
        || Normalize.normalize(data.staffLastName).concat(' ', Normalize.normalize(data.staffFirstName)).includes(normalizedFilter);
    };
  }

  /**
   * Assign input to data source filter
   * @param input from the user in the search field
   */
  public searchFilter(input: any) {
    this.dataSource.filter = input.target.value;
  }

  /**
   * Open dialog to choose filtering criteria, passing the available filters list and the current filter to the dialog
   * Get result after closing the dialog and filter accordingly the list
   */
  public doOpenFilterDialog() {
    this.dialog.open(FleetFilterDialogComponent, {
        width: UiDimensionValues.filterDialogPixelWidth,
        height: UiDimensionValues.filterDialogPixelHeight,
        data: {list: this.filterList, current: this.filter},
      }
    ).afterClosed().subscribe(filter => {
      if (filter) {
        this.filter = filter.filter;
        this.initStaffList();
      }
    });
  }

  /**
   * Initiate the staff list with all staff members
   */
  private initStaffList(): void {
    this.staffService.getStaff(this.filter, null).subscribe(
      staffList => {
        this.paginationChoices = PaginationListCreatorUtil.setPaginationList(staffList);
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
}

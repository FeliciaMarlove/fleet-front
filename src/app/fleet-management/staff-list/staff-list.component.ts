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

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['view', 'staffFirstName', 'staffLastName', 'hasCar', 'car_plate', 'car', 'unlink-action'];
  public colNames: string[] = ['', 'First name', 'Last name', 'Car?', 'Car plate', 'Car model', ''];
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
   * @private
   */
  private initSearchPredicate() {
    this.dataSource.filterPredicate = (data: StaffMember, filter: string) => {
      return  data.staffFirstName.toLocaleLowerCase().startsWith(filter.toLocaleLowerCase())
        || data.staffLastName.toLocaleLowerCase().startsWith(filter.toLocaleLowerCase())
      || data.staffFirstName.toLocaleLowerCase().concat(' ', data.staffLastName.toLocaleLowerCase()).startsWith(filter.toLocaleLowerCase())
        || data.staffLastName.toLocaleLowerCase().concat(' ', data.staffFirstName.toLocaleLowerCase()).startsWith(filter.toLocaleLowerCase())
        ;
    };
  }

  /**
   * Open dialog to choose filtering criteria, passing the available filters list and the current filter to the dialog
   * Get result after closing the dialog and filter accordingly the list
   */
  public doOpenFilterDialog() {
    this.dialog.open(FleetFilterDialogComponent, {
        width: '320px',
        height: '350px',
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
    // TODO
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

  public doOpenStaffDetail(staffId: any) {

  }

  public doOpenUnlinkDialog(staffId: any) {

  }

  /**
   * Assign input to data source filter
   * @param input from the user in the search field
   */
  public searchFilter(input: any) {
    this.dataSource.filter = input.target.value;
  }
}

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
import {MatSort} from '@angular/material/sort';
import {CarShortDisplayPipe} from '../../../shared/pipe/car-short-display.pipe';
import {Normalize} from '../../../shared/utils/normalize.util';
import {FleetCreateComponent} from '../fleet-create/fleet-create.component';
import {UiDimensionValues} from '../../../shared/utils/ui-dimension-values';
import {FleetViewComponent} from '../fleet-view/fleet-view.component';

@Component({
  selector: 'app-fleet-list',
  templateUrl: './fleet-list.component.html',
  styleUrls: ['./fleet-list.component.scss']
})

export class FleetListComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['view', 'plateNumber', 'brand', 'model', 'fuelType', 'staffMember', 'startDate', 'endDate', 'freeText'];
  public colNames: string[] = ['', 'Plate', 'Brand', 'Model', 'Fuel', 'Owner', 'Start', 'End', 'Note'];
  public dataSource = new MatTableDataSource<Car>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
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
    this.initSearchPredicate();
  }

  ngAfterViewInit(): void {
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
    this.dataSource.filterPredicate = (data: Car, filter: string) => {
      const normalizedFilter = Normalize.normalize(filter);
      return  Normalize.normalize(data.staffMember?.staffLastName)?.includes(normalizedFilter)
        || Normalize.normalize(data.staffMember?.staffLastName)?.includes(normalizedFilter)
        // tslint:disable-next-line:max-line-length
        || Normalize.normalize(data.staffMember?.staffLastName)?.concat(' ', Normalize.normalize(data.staffMember?.staffFirstName))?.includes(normalizedFilter)
        // tslint:disable-next-line:max-line-length
        || Normalize.normalize(data.staffMember?.staffFirstName)?.concat(' ', Normalize.normalize(data.staffMember?.staffLastName))?.includes(normalizedFilter)
        || Normalize.normalize(data.plateNumber).includes(normalizedFilter)
        || Normalize.normalize(CarShortDisplayPipe.prototype.transform(data)).includes(normalizedFilter);
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
      if (car.staffMemberId) {
        this.staffService.getStaffMember(car.staffMemberId).subscribe(staffMember => {
          car.staffMember = staffMember;
        });
      }
    }
  }

  public doOpenCarDetail(car: Car) {
    this.dialog.open(FleetViewComponent, {
      width: UiDimensionValues.detailsDialogPercentageWidth,
      height: UiDimensionValues.detailsDialogPercentageHeight,
      data: {car},
    }).afterClosed().subscribe(updated => {
      if (updated) {
        this.initCarsList();
      }
    });
  }

  public doOpenCarCreate() {
    this.dialog.open(FleetCreateComponent, {
      width: UiDimensionValues.detailsDialogPercentageWidth,
      height: UiDimensionValues.detailsDialogPercentageHeight
    }).afterClosed().subscribe(toUpdate => {
      if (toUpdate) {
        this.initCarsList();
      }
    });
  }
}

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {TankFilling} from '../../../shared/models/tank-filling.model';
import {TankFillingService} from '../../../core/http-services/tank-filling.service';
import {PaginationListCreatorUtil} from '../../../shared/utils/pagination-list-creator.util';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {FillupFilterDialogComponent} from './fillup-filter-dialog/fillup-filter-dialog.component';
import {FiltersListsService} from '../../../shared/utils/filters-lists.service';
import {MatSort} from '@angular/material/sort';
import {UiDimensionValues} from '../../../shared/utils/ui-dimension-values';
import {StaffMemberService} from '../../../core/http-services/staff-member.service';
import {CarService} from '../../../core/http-services/car.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ErrorOutputService} from '../../../shared/utils/error-output.service';

@Component({
  selector: 'app-fillups',
  templateUrl: './fillups-list.component.html',
  styleUrls: ['./fillups-list.component.scss']
})
export class FillupsListComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['warning-icon', 'dateTimeFilling', 'discrepancyType', 'plateNumber', 'staffMember', 'numberDiscrepancies'];
  public colNames = ['', 'Date', 'Discrepancy', 'Plate number', 'Staff member', 'Total'];
  public dataSource = new MatTableDataSource<TankFilling>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public title = 'Fuel usage report';
  public paginationChoices: number[] = [];
  public filter: string = null;
  public filterList: object;
  public option: any = null;
  private defaultFilter: string;
  public readonly iAm = 'fillup';

  constructor(
    private tankFillingService: TankFillingService,
    private dialog: MatDialog,
    private filtersListsService: FiltersListsService,
    private staffMemberService: StaffMemberService,
    private carService: CarService,
    private paginationUtil: PaginationListCreatorUtil,
    private errorOutputService: ErrorOutputService
  ) { }

  ngOnInit() {
    this.initAvailableFiltersList();
    this.initDefaultFilter();
    this.initFillups();
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
   * Get today's date one year ago
   * Return the date
   */
  private getTodayMinusOneYear(): Date {
    const d = new Date();
    const lastYear = d.getFullYear() - 1;
    d.setFullYear(lastYear);
    return d;
  }

  /**
   * Open dialog to choose filtering criteria, passing the available filters list and the current filter to the dialog
   * Get result after closing the dialog and filter accordingly the list
   */
  public doOpenFilterDialog() {
    this.dialog.open(FillupFilterDialogComponent, {
        width: UiDimensionValues.filterDialogPixelWidth,
        height: UiDimensionValues.filterDialogPixelHeight,
        data: {list: this.filterList, current: this.filter, option: this.option},
      }
    ).afterClosed().subscribe(filter => {
      if (filter) {
        this.filter = filter.filter;
        this.option = filter.option;
        this.initFillups();
      }
    });
  }

  /**
   * Initialize the list with all fuel operations
   */
  private initFillups() {
    this.tankFillingService.getFillUps(this.filter, this.option).subscribe(
      fillups => {
        this.paginationChoices = this.paginationUtil.setPaginationList(fillups.length);
        this.dataSource.data = fillups;
        fillups.forEach(fillup => {
          this.carService.getCar(fillup.plateNumber).subscribe(car => {
            this.staffMemberService.getStaffMember(car.staffMemberId).subscribe(
              sm => fillup.staffMember = sm,
              () => this.errorOutputService.outputWarningInSnackbar(this.iAm, 'Could not retrieve all staff members.')
            );
          },
            () => this.errorOutputService.outputWarningInSnackbar(this.iAm, 'Could not retrieve all cars')
          );
        });
      },
      () => this.errorOutputService.outputFatalErrorInSnackBar(this.iAm, 'Could not retrieve fuel fillups.')
    );
  }

  public doOpenWarning(fillup: TankFilling) {
    // TODO
    console.log(fillup);
  }
}

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Inspection} from '../../../shared/models/inspection.model';
import {InspectionService} from '../../../core/http-services/inspection.service';
import {PaginationListCreatorUtil} from '../../../shared/utils/pagination-list-creator.util';
import {StaffMemberService} from '../../../core/http-services/staff-member.service';
import {CarService} from '../../../core/http-services/car.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {InspectionFilterDialogComponent} from './inspection-filter-dialog/inspection-filter-dialog.component';
import {FiltersListsService} from '../../../shared/utils/filters-lists.service';
import {MatSort} from '@angular/material/sort';
import {CarShortDisplayPipe} from '../../../shared/pipe/car-short-display.pipe';
import {Normalize} from '../../../shared/utils/normalize.util';
import {UiDimensionValues} from '../../../shared/utils/ui-dimension-values';
import {InspectionCreateComponent} from '../inspection-create/inspection-create.component';
import {ErrorOutputService} from '../../../shared/utils/error-output.service';

@Component({
  selector: 'app-inspections-list',
  templateUrl: './inspections-list.component.html',
  styleUrls: ['./inspections-list.component.scss']
})
export class InspectionsListComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['view', 'inspectionDate', 'expertisedBy', 'plateNumber', 'car', 'staffMember', 'damaged', 'sentDate'];
  public colNames: string[] = ['', 'Date of inspection', 'Expertised by', 'Plate number', 'Car', 'Staff Member', 'Damage?', 'Sent'];
  public dataSource = new MatTableDataSource<Inspection>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public title = 'Car inspections';
  public paginationChoices: number[] = [];
  public filter: string = null;
  public filterList: object;
  public option: Date = null;
  private defaultFilter: string;
  public readonly iAm = 'inspection';
  public loading = true;
  public loaded = false;

  constructor(
    private inspectionService: InspectionService,
    private staffService: StaffMemberService,
    private carService: CarService,
    private dialog: MatDialog,
    private filtersListsService: FiltersListsService,
    private paginationUtil: PaginationListCreatorUtil,
    private errorOutputService: ErrorOutputService
  ) {
  }

  ngOnInit() {
    this.initAvailableFiltersList();
    this.initDefaultFilter();
    this.initInspectionsList();
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
      this.option = this.getTodayMinusOneYear();
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
   * Override filter predicate used by filter function of DataSource
   * Set filtered columns to staff name and first name (independently or together)
   */
  private initSearchPredicate() {
    this.dataSource.filterPredicate = (data: Inspection, filter: string) => {
      const normalizedFilter = Normalize.normalize(filter);
      return Normalize.normalize(data.staffMember.staffLastName).includes(normalizedFilter)
        || Normalize.normalize(data.staffMember.staffFirstName).includes(normalizedFilter)
        || Normalize.normalize(data.staffMember.staffLastName).concat(' ', Normalize.normalize(data.staffMember.staffFirstName)).includes(normalizedFilter)
        || Normalize.normalize(data.staffMember.staffFirstName).concat(' ', Normalize.normalize(data.staffMember.staffLastName)).includes(normalizedFilter)
        || Normalize.normalize(data.expertisedBy).includes(normalizedFilter)
        || Normalize.normalize(data.plateNumber).includes(normalizedFilter)
        || Normalize.normalize(CarShortDisplayPipe.prototype.transform(data.car)).includes(normalizedFilter);
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
    this.dialog.open(InspectionFilterDialogComponent, {
        width: UiDimensionValues.filterDialogPixelWidth,
        height: UiDimensionValues.filterDialogPixelHeight,
        data: {list: this.filterList, current: this.filter, option: this.option},
      }
    ).afterClosed().subscribe(filter => {
      if (filter) {
        this.loading = true;
        this.loaded = false;
        this.filter = filter.filter;
        this.option = filter.option;
        this.initInspectionsList();
      }
    });
  }

  /**
   * Initiate the inspections list
   */
  private initInspectionsList() {
    this.inspectionService.getInspections(this.filter, this.option).subscribe(
      inspections => {
        if (inspections) {
          this.assignInspectionsList(inspections);
        } else {
          this.loaded = true;
          this.loading = false;
        }
      },
      () => {
        this.errorOutputService.outputFatalErrorInSnackBar(this.iAm, 'Could not retrieve inspections list.');
        this.loaded = true;
        this.loading = false;
      }
    );
  }

  /**
   * Assign inspections list to the Data source
   * Create pagination according to list size and add Staff member and Car to each Inspection in the list
   * @param cars The list of inspections to display
   */
  private assignInspectionsList(inspections) {
    this.assignCarAndStaffMember(inspections);
    this.paginationChoices = this.paginationUtil.setPaginationList(inspections.length);
    this.dataSource.data = inspections;
    this.loaded = true;
    this.loading = false;
  }

  public doOpenInspectionDetail(inspection: any) {
    console.log(inspection); // TODO
  }

  /**
   * Assign car and staff member to each inspection in the list
   * @param inspections The list of inspections
   */
  private assignCarAndStaffMember(inspections: Inspection[]) {
    for (const insp of inspections) {
      this.staffService.getStaffMember(insp.staffMemberId).subscribe(staffMember => {
          insp.staffMember = staffMember;
        },
        () => this.errorOutputService.outputWarningInSnackbar(this.iAm, 'Could not retrieve all staff members information.')
      );
      this.carService.getCar(insp.plateNumber).subscribe(car => {
          insp.car = car;
        },
        () => this.errorOutputService.outputWarningInSnackbar(this.iAm, 'Could not retrieve all cars information.')
      );
    }
  }

  public doOpenInspectionCreate() {
    this.dialog.open(InspectionCreateComponent, {
      width: UiDimensionValues.detailsDialogPercentageWidth,
      height: UiDimensionValues.detailsDialogPercentageHeight,
      data: null
    }).afterClosed().subscribe(toUpdate => {
      if (toUpdate) {
        this.initInspectionsList();
      }
    });
  }
}

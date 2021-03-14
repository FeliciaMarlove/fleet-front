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

@Component({
  selector: 'app-inspections-list',
  templateUrl: './inspections-list.component.html',
  styleUrls: ['./inspections-list.component.scss']
})
export class InspectionsListComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['view', 'idate', 'iby', 'iplate', 'icar', 'istaff', 'idamaged', 'isent'];
  public colNames: string[] = ['', 'Date of inspection', 'Expertised by', 'Plate number', 'Car', 'Staff Member', 'Damage?', 'Sent?'];
  public dataSource = new MatTableDataSource<Inspection>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public title = 'Car inspections';
  public paginationChoices: number[] = [10];
  public filter: string = null;
  public filterList: object;
  public option: Date = null;
  private defaultFilter: string;
  public readonly iAm = 'inspection';

  constructor(
    private inspectionService: InspectionService,
    private staffService: StaffMemberService,
    private carService: CarService,
    private dialog: MatDialog,
    private filtersListsService: FiltersListsService
  ) { }

  ngOnInit() {
    this.initAvailableFiltersList();
    this.initDefaultFilter();
    this.initInspectionsList();
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
   * Open dialog to choose filtering criteria, passing the available filters list and the current filter to the dialog
   * Get result after closing the dialog and filter accordingly the list
   */
  public doOpenFilterDialog() {
    this.dialog.open(InspectionFilterDialogComponent, {
        width: '320px',
        height: '350px',
        data: {list: this.filterList, current: this.filter, option: this.option},
      }
    ).afterClosed().subscribe(filter => {
      if (filter) {
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
      inspections => this.assignInspectionsList(inspections)
    );
  }

  /**
   * Assign inspections list to the Data source
   * Create pagination according to list size and add Staff member and Car to each Inspection in the list
   * @param cars The list of inspections to display
   */
  private assignInspectionsList(inspections) {
    this.assignCarAndStaffMember(inspections);
    this.paginationChoices = PaginationListCreatorUtil.setPaginationList(inspections);
    this.dataSource.data = inspections;
  }

  public doOpenInspectionDetail(inspection: any) {
    console.log(inspection);
  }

  /**
   * Assign car and staff member to each inspection in the list
   * @param inspections The list of inspections
   */
  private assignCarAndStaffMember(inspections: Inspection[]) {
    for (const insp of inspections) {
      this.staffService.getStaffMember(insp.staffMemberId).subscribe(staffMember => {
        insp.staffMember = staffMember;
      });
      this.carService.getCar(insp.plateNumber).subscribe(car => {
        insp.car = car;
      });
    }
  }
}

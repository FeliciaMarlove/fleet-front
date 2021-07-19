import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {LeasingCompanyService} from '../../../core/http-services/leasing-company.service';
import {LeasingCompany} from '../../../shared/models/leasing-company.model';
import {PaginationListCreatorUtil} from '../../../shared/utils/pagination-list-creator.util';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {FleetFilterDialogComponent} from '../../fleet/fleet-list/fleet-filter-dialog/fleet-filter-dialog.component';
import {FiltersListsService} from '../../../shared/utils/filters-lists.service';
import {MatSort} from '@angular/material/sort';
import {Normalize} from '../../../shared/utils/normalize.util';
import {LeasingCompaniesDetailComponent} from '../leasing-companies-detail/leasing-companies-detail.component';
import {UiDimensionValues} from '../../../shared/utils/ui-dimension-values';

@Component({
  selector: 'app-leasing-companies-list',
  templateUrl: './leasing-companies-list.component.html',
  styleUrls: ['./leasing-companies-list.component.scss']
})
export class LeasingCompaniesListComponent implements OnInit, AfterViewInit {
  // tslint:disable-next-line:max-line-length
  public displayedColumns: string[] = ['edit', 'leasingCompanyName', 'leasingCompanyContactPerson', 'leasingCompanyPhone', 'leasingCompanyEmail', 'active'];
  public colNames: string[] = ['', 'Name', 'Contact person', 'Phone', 'Email', 'Active'];
  public dataSource = new MatTableDataSource<LeasingCompany>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public title = 'Leasing companies';
  public paginationChoices: number[] = [];
  public filter: string = null;
  public filterList: object;
  public option: string = null;
  private defaultFilter: string;
  public readonly iAm = 'leasing';

  constructor(
    private leasingService: LeasingCompanyService,
    private dialog: MatDialog,
    private filtersListsService: FiltersListsService,
    private paginationListUtil: PaginationListCreatorUtil
  ) { }

  ngOnInit() {
    this.initAvailableFiltersList();
    this.initDefaultFilter();
    this.initLeasingCompanies();
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
        this.initLeasingCompanies();
      }
    });
  }

  doOpenLeasingUpdOrCreate(leasingCompany: LeasingCompany) {
    this.dialog.open(LeasingCompaniesDetailComponent, {
      width: UiDimensionValues.detailsDialogPercentageWidth,
      height: UiDimensionValues.detailsDialogPercentageHeight,
      data: {leasingCompany}
    }).afterClosed().subscribe(toUpdate => {
      if (toUpdate) {
        this.initLeasingCompanies();
      }
    });
  }

  /**
   * Initiate the list of all leasing companies
   */
  private initLeasingCompanies() {
    this.leasingService.getLeasingCompanies(this.filter, null).subscribe(
      leasingCompanies => {
        this.paginationChoices = this.paginationListUtil.setPaginationList(leasingCompanies.length);
        this.dataSource.data = leasingCompanies;
      },
      error => console.log(error)
    );
  }

  /**
   * Override filter predicate used by filter function of DataSource
   * Set filtered columns to staff name and first name (independently or together)
   */
  private initSearchPredicate() {
    this.dataSource.filterPredicate = (data: LeasingCompany, filter: string) => {
      const normalizedFilter = Normalize.normalize(filter);
      return Normalize.normalize(data.leasingCompanyContactPerson).includes(normalizedFilter)
      || Normalize.normalize(data.leasingCompanyEmail).includes(normalizedFilter)
      || Normalize.normalize(data.leasingCompanyName).includes(normalizedFilter);
    };
  }

  /**
   * Assign input to data source filter
   * @param input from the user in the search field
   */
  public searchFilter(input: any) {
    this.dataSource.filter = input.target.value;
  }
}
